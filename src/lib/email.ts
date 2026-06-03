import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

let sesClient: SESv2Client | null = null;

function getSesClient() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  if (!sesClient) {
    sesClient = new SESv2Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return sesClient;
}

export function isEmailConfigured() {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.CONTACT_EMAIL_FROM &&
      process.env.CONTACT_EMAIL_TO,
  );
}

export async function sendNotificationEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const client = getSesClient();
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!client || !from || !to) {
    return { sent: false, reason: "Email environment variables are not configured." };
  }

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: html,
            },
          },
        },
      },
    }),
  );

  return { sent: true };
}

