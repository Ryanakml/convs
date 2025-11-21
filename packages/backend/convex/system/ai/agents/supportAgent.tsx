import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { createOpenAI } from "@ai-sdk/openai";

// DigitalOcean's model API is OpenAI-compatible, so wire up the client once and reuse it.
const openai = createOpenAI({
  apiKey: process.env.DIGITALOCEAN_API_KEY ?? process.env.OPENAI_API_KEY!,
  baseURL: process.env.DIGITALOCEAN_BASE_URL ?? process.env.OPENAI_BASE_URL,
});

export const supportAgent = new Agent(components.agent, {
  name: "support-agent",
  languageModel: openai("gpt-4o-mini"),
  instructions: "You are a helpful support agent.",
});
