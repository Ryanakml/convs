import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "support-agent",
  languageModel: groq("llama-3.1-8b-instant"),
  instructions: `You are a helpful support agent. Use "resolveConversatio" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or requests a human explicitly.`,
});
