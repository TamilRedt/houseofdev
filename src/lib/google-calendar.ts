const INDIA_TIME_ZONE = "Asia/Kolkata";
const DEFAULT_DURATION_MINUTES = 45;

type CalendarSlot = {
  start: string;
  end: string;
};

export type CalendarBookingResult = {
  configured: boolean;
  available: boolean | null;
  booked: boolean;
  eventId?: string;
  eventUrl?: string;
  reason?: string;
};

function getCalendarConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "arasanredt@gmail.com";

  return {
    configured: Boolean(clientId && clientSecret && refreshToken && calendarId),
    clientId,
    clientSecret,
    refreshToken,
    calendarId,
  };
}

function parseTime(value: string) {
  const normalized = value.trim().toUpperCase();
  const twelveHour = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (twelveHour) {
    let hour = Number(twelveHour[1]);
    const minute = Number(twelveHour[2]);
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
    if (twelveHour[3] === "AM" && hour === 12) hour = 0;
    if (twelveHour[3] === "PM" && hour !== 12) hour += 12;
    return { hour, minute };
  }

  const twentyFourHour = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (!twentyFourHour) return null;
  const hour = Number(twentyFourHour[1]);
  const minute = Number(twentyFourHour[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function buildConsultationSlot(date: string, time: string, durationMinutes = DEFAULT_DURATION_MINUTES): CalendarSlot | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = parseTime(time);
  if (!parsed) return null;

  const offset = "+05:30";
  const hour = String(parsed.hour).padStart(2, "0");
  const minute = String(parsed.minute).padStart(2, "0");
  const start = new Date(`${date}T${hour}:${minute}:00${offset}`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return { start: start.toISOString(), end: end.toISOString() };
}

async function getAccessToken() {
  const config = getCalendarConfig();
  if (!config.configured) return null;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId!,
      client_secret: config.clientSecret!,
      refresh_token: config.refreshToken!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Google OAuth token request failed with ${response.status}.`);
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error("Google OAuth response did not include an access token.");
  return payload.access_token;
}

export async function checkCalendarAvailability(slot: CalendarSlot): Promise<CalendarBookingResult> {
  const config = getCalendarConfig();
  if (!config.configured) {
    return {
      configured: false,
      available: null,
      booked: false,
      reason: "Google Calendar environment variables are not configured.",
    };
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: slot.start,
        timeMax: slot.end,
        timeZone: INDIA_TIME_ZONE,
        items: [{ id: config.calendarId }],
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Google Calendar availability check failed with ${response.status}.`);
    const payload = (await response.json()) as {
      calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>;
    };
    const busy = payload.calendars?.[config.calendarId!]?.busy || [];
    return { configured: true, available: busy.length === 0, booked: false };
  } catch (error) {
    return {
      configured: true,
      available: null,
      booked: false,
      reason: error instanceof Error ? error.message : "Google Calendar availability check failed.",
    };
  }
}

export async function createConsultationEvent({
  slot,
  fullName,
  email,
  phone,
  companyName,
  service,
  message,
}: {
  slot: CalendarSlot;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  service: string;
  message: string;
}): Promise<CalendarBookingResult> {
  const config = getCalendarConfig();
  if (!config.configured) {
    return {
      configured: false,
      available: null,
      booked: false,
      reason: "Google Calendar environment variables are not configured.",
    };
  }

  const availability = await checkCalendarAvailability(slot);
  if (availability.available !== true) return availability;

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId!)}/events?sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `HouseOfDev consultation — ${fullName}`,
          description: [
            `Company: ${companyName || "Not provided"}`,
            `Phone: ${phone}`,
            `Service: ${service}`,
            "",
            message,
          ].join("\n"),
          start: { dateTime: slot.start, timeZone: INDIA_TIME_ZONE },
          end: { dateTime: slot.end, timeZone: INDIA_TIME_ZONE },
          attendees: email ? [{ email }] : [],
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error(`Google Calendar event creation failed with ${response.status}.`);
    const event = (await response.json()) as { id?: string; htmlLink?: string };
    return {
      configured: true,
      available: true,
      booked: true,
      eventId: event.id,
      eventUrl: event.htmlLink,
    };
  } catch (error) {
    return {
      configured: true,
      available: true,
      booked: false,
      reason: error instanceof Error ? error.message : "Google Calendar event creation failed.",
    };
  }
}
