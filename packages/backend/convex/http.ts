import { Webhook } from "svix";
import { createClerkClient } from "@clerk/backend";
import { WebhookEvent } from "@clerk/backend";
import { httpRouter, HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const clerkSecret = process.env.CLERK_SECRET_KEY;

if (!clerkSecret) {
  throw new Error("Missing CLERK_SECRET_KEY environment variable");
}

export const clerkClient = createClerkClient({
  secretKey: clerkSecret,
  apiVersion: "v1",
});

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const event = await validateRequest(req);
    if (!event) {
      return new Response("Invalid request", { status: 400 });
    }
    switch (event.type) {
      case "subscription.updated":
        const subscription = event.data as {
          status: string;
          payer?: {
            organization_id: string;
          };
        };

        const organizationId = subscription.payer?.organization_id;
        if (!organizationId) {
          return new Response("Invalid organization id", { status: 400 });
        }

        const maxAllowedMemberships = subscription.status === "active" ? 3 : 1;

        await clerkClient.organizations.updateOrganization(organizationId, {
          maxAllowedMemberships: maxAllowedMemberships,
        });

        await ctx.runMutation(internal.system.subscriptions.upsert, {
          organizationId,
          status: subscription.status,
        });
        break;
      default:
        console.log("Unknown event type: ", event.type);
        break;
    }
    return new Response("OK", { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  const wh = new Webhook(webhookSecret);

  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Failed to verify webhook signature:", error);
    return null;
  }
}
export default http;
