import type { VercelRequest, VercelResponse } from '@vercel/node';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;

interface SubscribeBody {
  email?: unknown;
  firstName?: unknown;
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_AI_COURSE_LIST_ID;
  const listId = Number(listIdRaw);

  if (!apiKey || !listIdRaw || !Number.isFinite(listId)) {
    console.error('[subscribe] Missing or invalid Brevo env vars');
    return res
      .status(500)
      .json({ ok: false, message: 'Subscription service is not configured.' });
  }

  const body: SubscribeBody =
    typeof req.body === 'string' ? safeJsonParse(req.body) : req.body ?? {};

  const email = asTrimmedString(body.email);
  const firstName = asTrimmedString(body.firstName);

  if (
    !email ||
    email.length > MAX_FIELD_LENGTH ||
    !EMAIL_REGEX.test(email) ||
    !firstName ||
    firstName.length > MAX_FIELD_LENGTH
  ) {
    return res
      .status(400)
      .json({ ok: false, message: 'Please provide a valid name and email.' });
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName },
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (brevoRes.ok) {
      return res.status(200).json({ ok: true });
    }

    const upstreamBody = await brevoRes.text().catch(() => '');
    console.error(
      `[subscribe] Brevo responded ${brevoRes.status}: ${upstreamBody.slice(0, 500)}`,
    );
    return res
      .status(502)
      .json({ ok: false, message: 'Subscription failed, please try again.' });
  } catch (err) {
    console.error('[subscribe] Brevo request error', err);
    return res
      .status(502)
      .json({ ok: false, message: 'Subscription failed, please try again.' });
  }
}

function safeJsonParse(raw: string): SubscribeBody {
  try {
    return JSON.parse(raw) as SubscribeBody;
  } catch {
    return {};
  }
}
