export const EMBED_CONFIG = {
  // This should point to the "apps/widget" deployment, NOT "apps/web" (Admin Dashboard).
  WIDGET_URL:
    import.meta.env.VITE_WIDGET_URL || "https://convs-widget.vercel.app",
  DEFAULT_POSITION: "bottom-right" as const,
};
