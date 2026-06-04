import { sendNotificationEmail } from "@/lib/email";

export type NotificationResult = {
  channel: "email" | "telegram" | "whatsapp";
  sent: boolean;
  target: string | null;
  reason?: string;
  response?: string;
};

type LeadNotification = {
  subject: string;
  html: string;
  text: string;
};

function truncate(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit - 3)}...` : value;
}

async function sendEmailNotification(payload: LeadNotification): Promise<NotificationResult> {
  try {
    const result = await sendNotificationEmail({
      subject: payload.subject,
      html: payload.html,
    });

    return {
      channel: "email",
      sent: result.sent,
      target: process.env.CONTACT_EMAIL_TO || null,
      reason: result.sent ? undefined : result.reason,
    };
  } catch (error) {
    return {
      channel: "email",
      sent: false,
      target: process.env.CONTACT_EMAIL_TO || null,
      reason: error instanceof Error ? error.message : "Email notification failed.",
    };
  }
}

async function sendTelegramNotification(payload: LeadNotification): Promise<NotificationResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      channel: "telegram",
      sent: false,
      target: chatId || null,
      reason: "Telegram environment variables are not configured.",
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncate(payload.text, 3900),
      }),
    });
    const body = await response.text();

    return {
      channel: "telegram",
      sent: response.ok,
      target: chatId,
      reason: response.ok ? undefined : `Telegram returned ${response.status}.`,
      response: truncate(body, 1000),
    };
  } catch (error) {
    return {
      channel: "telegram",
      sent: false,
      target: chatId,
      reason: error instanceof Error ? error.message : "Telegram notification failed.",
    };
  }
}

async function sendWhatsAppNotification(payload: LeadNotification): Promise<NotificationResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const toNumber = process.env.WHATSAPP_TO_NUMBER;
  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION || "v20.0";

  if (!accessToken || !phoneNumberId || !toNumber) {
    return {
      channel: "whatsapp",
      sent: false,
      target: toNumber || null,
      reason: "WhatsApp Cloud API environment variables are not configured.",
    };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toNumber,
        type: "text",
        text: {
          preview_url: false,
          body: truncate(payload.text, 3900),
        },
      }),
    });
    const body = await response.text();

    return {
      channel: "whatsapp",
      sent: response.ok,
      target: toNumber,
      reason: response.ok ? undefined : `WhatsApp returned ${response.status}.`,
      response: truncate(body, 1000),
    };
  } catch (error) {
    return {
      channel: "whatsapp",
      sent: false,
      target: toNumber,
      reason: error instanceof Error ? error.message : "WhatsApp notification failed.",
    };
  }
}

export async function sendLeadNotifications(payload: LeadNotification) {
  return Promise.all([
    sendEmailNotification(payload),
    sendTelegramNotification(payload),
    sendWhatsAppNotification(payload),
  ]);
}
