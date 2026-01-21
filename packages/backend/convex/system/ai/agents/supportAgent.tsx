import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_INSTRUCTIONS } from "../prompts";
import { escalateConversation } from "../tools/escalateConversation";
import { resolveConversation } from "../tools/resolveConversation";
import { search } from "../tools/search";

export const supportAgent = new Agent(components.agent, {
  name: "support-agent",
  languageModel: groq("llama3-70b-8192"),
  instructions: SUPPORT_AGENT_INSTRUCTIONS,
  tools: {
    search,
    escalateConversation,
    resolveConversation,
  },
});
