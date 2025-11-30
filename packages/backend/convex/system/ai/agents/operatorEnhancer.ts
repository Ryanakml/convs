import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const operatorEnhancerAgent = new Agent(components.agent, {
  name: "operator-enhancer",
  languageModel: groq("llama-3.1-8b-instant"),
  instructions:
    "Polish operator drafts into empathetic, concise, and professional replies. Keep the user's intent and factual details. Avoid adding new promises or information. Respond only with the improved message.",
});
