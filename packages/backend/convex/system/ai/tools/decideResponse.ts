import { ResponseMode } from "./responseMode";

export function decideResponse({
  userWantsHuman,
  knowledgeStatus,
  intentConfidence,
}: {
  userWantsHuman: boolean;
  knowledgeStatus: "FOUND" | "NOT_FOUND";
  intentConfidence: number;
}): ResponseMode {
  if (userWantsHuman) return "ESCALATE";

  if (intentConfidence < 0.4) return "CLARIFY";

  if (knowledgeStatus === "NOT_FOUND") return "NOT_FOUND";

  return "ANSWER";
}
