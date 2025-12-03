import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getSecretValue, parseSecretValue } from "../lib/secrets";

export const getVapiSecrets = action({
    args: {
        organizationId: v.string()
    },
    handler: async (ctx, args) => {
        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdAndService,
            {
                organizationId: args.organizationId,
                service: "vapi"
            }
        )

        if (!plugin) {
            throw new ConvexError({
                code: "UNDEFINED",
                message: "Plugin not found"
            })
        }

        const secretName = plugin.secretName
        const secretValue = await getSecretValue(secretName)
        const secretData = parseSecretValue<{
            publicApiKey: string,
            privateApiKey: string
        }>(secretValue)

    if (!secretData) {
        throw new ConvexError({
            code: "UNDEFINED",
            message: "Secret not found"
        })
    }

    if (!secretData.publicApiKey) {
        throw new ConvexError({
            code: "UNDEFINED",
            message: "Public API Key not found"
        })
    }

    if (!secretData.privateApiKey) {
        throw new ConvexError({
            code: "UNDEFINED",
            message: "Private API Key not found"
        })
    }

    return {
        publicApiKey: secretData.publicApiKey
    }
    }
})