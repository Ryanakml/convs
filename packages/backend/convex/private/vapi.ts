import { VapiClient, Vapi } from "@vapi-ai/server-sdk";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getSecretValue, parseSecretValue } from "../lib/secrets";
import { ConvexError } from "convex/values";

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity is not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization ID found in user identity",
      });
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      { organizationId: orgId, service: "vapi" }
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi plugin not found for organization",
      });
    }

    const secretName = plugin.secretName as string;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretValue<{
      publicApiKey: string;
      privateApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Failed to parse Vapi plugin secret data",
      });
    }

    if (!secretData.publicApiKey || !secretData.privateApiKey) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Vapi plugin secret data is missing required keys",
      });
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    const assistants = await vapiClient.assistants.list();

    return assistants;
  },
});

export const getPhoneNumberVapiClient = action({
  args: {},
  handler: async (ctx): Promise<Vapi.ListPhoneNumbersResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity is not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization ID found in user identity",
      });
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      { organizationId: orgId, service: "vapi" }
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi plugin not found for organization",
      });
    }

    const secretName = plugin.secretName as string;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretValue<{
      publicApiKey: string;
      privateApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Failed to parse Vapi plugin secret data",
      });
    }

    if (!secretData.publicApiKey || !secretData.privateApiKey) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Vapi plugin secret data is missing required keys",
      });
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    const phoneNumbers = await vapiClient.phoneNumbers.list();

    return phoneNumbers;
  },
});
