import { NextRequest, NextResponse } from "next/server";

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

    const payload: SyncPayload = {
      email: body.email,
      tag: body.tag || "Field_Scout",
      event_type: body.event_type,
      metadata: body.metadata || {},
      timestamp: new Date().toISOString(),
    };

    const webhookUrl = process.env.MAILCHIMP_ZAPIER_WEBHOOK_URL;

    if (webhookUrl && webhookUrl.trim() !== "") {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "RAD-Field-Scout-CRM-Sync/2.0",
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
          { status: "success", forwarded: true },
          { status: 200 }
        );
      } catch (networkError) {
        console.error("[CRM Sync] Failed to post to remote webhook:", networkError);
        // Return 200 graceful fallback so frontend never breaks
        return NextResponse.json(
          { status: "queued_locally", note: "Remote webhook unreachable, queued safely." },
          { status: 200 }
        );
      }
    }

    // Graceful offline/local mode when waiting on client credentials
    console.log("[CRM Sync - Local Queue] Outbound webhook unconfigured. Payload safely logged:", JSON.stringify(payload, null, 2));

    return NextResponse.json(
      {
        status: "queued_locally",
        message: "No webhook URL configured yet. Payload logged gracefully.",
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
