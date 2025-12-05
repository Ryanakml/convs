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

const WIDGET_SRC = "https://convs-widget.vercel.app/widget.js";

export const HTML_SCRIPT = `<script src="${WIDGET_SRC}" data-organization-id="{{ORGANIZATION_ID}}" async></script>`;

export const JAVASCRIPT_SCRIPT = `const script = document.createElement("script");
script.src = "${WIDGET_SRC}";
script.async = true;
script.dataset.organizationId = "{{ORGANIZATION_ID}}";
document.body.appendChild(script);`;

export const REACT_SCRIPT = `useEffect(() => {
  const script = document.createElement("script");
  script.src = "${WIDGET_SRC}";
  script.async = true;
  script.dataset.organizationId = "{{ORGANIZATION_ID}}";
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);`;

export const NEXTJS_SCRIPT = `import Script from "next/script";

export function WidgetScript() {
  return (
    <Script
      src="${WIDGET_SRC}"
      strategy="afterInteractive"
      data-organization-id="{{ORGANIZATION_ID}}"
    />
  );
}`;
