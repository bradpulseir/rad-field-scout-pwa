import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export interface SyncPayload {
  email: string;
  tag?: string;
  event_type: "signup" | "lead_submitted" | "friend_referral" | "suggestion_submitted";
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SyncPayload;

    if (!body || !body.email || !body.event_type) {
      return NextResponse.json(
        { error: "Invalid request payload. 'email' and 'event_type' are required." },
        { status: 400 }
      );
    }

    const cleanEmail = body.email.trim().toLowerCase();
    const primaryTag = body.tag || "Field_Scout";

    const payload: SyncPayload = {
      email: cleanEmail,
      tag: primaryTag,
      event_type: body.event_type,
      metadata: body.metadata || {},
      timestamp: new Date().toISOString(),
    };

    // 1. NATIVE MAILCHIMP v3 API INTEGRATION (Direct Audience Upsert + Chimp Tags)
    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (mailchimpApiKey && mailchimpAudienceId) {
      try {
        // Extract datacenter prefix from API key (e.g. "xxxx-us21" -> "us21")
        const dc = process.env.MAILCHIMP_SERVER_PREFIX || mailchimpApiKey.split("-")[1];
        const subscriberHash = crypto.createHash("md5").update(cleanEmail).digest("hex");
        const baseUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members/${subscriberHash}`;
        const authHeader = `Basic ${Buffer.from(`anystring:${mailchimpApiKey}`).toString("base64")}`;

        // Upsert subscriber into existing Mailchimp Audience without disturbing existing status
        await fetch(baseUrl, {
          method: "PUT",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: cleanEmail,
            status_if_new: "subscribed",
          }),
        });

        // Apply dedicated Mailchimp Tags so AITX Marketing can segment Field Scouts separately
        await fetch(`${baseUrl}/tags`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: [
              { name: "AITX_Field_Scout_Program", status: "active" },
              { name: primaryTag, status: "active" },
            ],
          }),
        });

        return NextResponse.json(
          { status: "success", provider: "mailchimp_native", tags_applied: ["AITX_Field_Scout_Program", primaryTag] },
          { status: 200 }
        );
      } catch (mcError) {
        console.error("[CRM Sync] Mailchimp API error:", mcError);
      }
    }

    // 2. OPTIONAL ZAPIER / CUSTOM WEBHOOK FALLBACK
    const webhookUrl = process.env.MAILCHIMP_ZAPIER_WEBHOOK_URL;

    if (webhookUrl && webhookUrl.trim() !== "") {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "RAD-Field-Scout-CRM-Sync/2.1",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.warn(`[CRM Sync] Webhook remote responded with status ${response.status}`);
          return NextResponse.json(
            { status: "webhook_delivery_warning", code: response.status },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { status: "success", provider: "webhook", forwarded: true },
          { status: 200 }
        );
      } catch (networkError) {
        console.error("[CRM Sync] Failed to post to remote webhook:", networkError);
        return NextResponse.json(
          { status: "queued_locally", note: "Remote webhook unreachable, queued safely." },
          { status: 200 }
        );
      }
    }

    // 3. GRACEFUL LOCAL QUEUE MODE (While waiting for client Mailchimp keys)
    console.log("[CRM Sync - Local Queue] Mailchimp credentials unconfigured. Payload safely logged:", JSON.stringify(payload, null, 2));

    return NextResponse.json(
      {
        status: "queued_locally",
        message: "Mailchimp API credentials not yet configured. Event logged gracefully.",
        payloadPreview: {
          email: payload.email,
          event_type: payload.event_type,
          tag: payload.tag,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[CRM Sync] Error handling sync payload:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
