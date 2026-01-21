import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { OPERATOR_ENHANCER_INSTRUCTIONS } from "../prompts";

export const operatorEnhancerAgent = new Agent(components.agent, {
  name: "operator-enhancer",
  languageModel: groq("llama-3.1-8b-instant"),
  instructions: OPERATOR_ENHANCER_INSTRUCTIONS,
});
