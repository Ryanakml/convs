export const INTEGRATIONS = [
  {
    id: "html",
    title: "HTML",
    icon: "/languages/html.webp",
  },
  {
    id: "react",
    title: "React",
    icon: "/languages/react.webp",
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "/languages/nextjs.webp",
  },
  {
    id: "javascript",
    title: "JavaScript",
    icon: "/languages/javascript.webp",
  },
];

export type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export const HTML_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const REACT_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const NEXTJS_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const JAVASCRIPT_SCRIPT = `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`;
