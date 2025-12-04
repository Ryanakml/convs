import {
  HTML_SCRIPT,
  type IntegrationId,
  JAVASCRIPT_SCRIPT,
  NEXTJS_SCRIPT,
  REACT_SCRIPT,
} from "./constant";

export const createScript = (
  integrationId: IntegrationId,
  organizationId: string
) => {
  if (integrationId === "html") {
    return HTML_SCRIPT.replace("{{ORGANIZATION_ID}}", organizationId);
  }
  if (integrationId === "react") {
    return REACT_SCRIPT.replace("{{ORGANIZATION_ID}}", organizationId);
  }
  if (integrationId === "nextjs") {
    return NEXTJS_SCRIPT.replace("{{ORGANIZATION_ID}}", organizationId);
  }
  if (integrationId === "javascript") {
    return JAVASCRIPT_SCRIPT.replace("{{ORGANIZATION_ID}}", organizationId);
  }
  return "";
};
