# Convs Monorepo

Chat/voice widget platform + admin dashboard. This monorepo contains the embeddable widget, the admin app, and the Convex backend for data and AI integrations.

## Structure

- `apps/web` - Admin dashboard (Next.js 15) to manage orgs, contacts, and conversations.
- `apps/widget` - Chat/voice widget (Next.js 15) displayed on end-user websites.
- `apps/embed` - Embed script (Vite) that injects the button + widget iframe into any page.
- `packages/backend` - Convex functions, actions, and schema.
- `packages/ui` - Shared UI components, hooks, and styles.
- `packages/math` - Sample shared package (utility).

## Quick Start

```bash
pnpm install
pnpm dev
```

Default ports:
- `web`: http://localhost:3000
- `widget`: http://localhost:3001
- `embed`: http://localhost:3002

## Embed Widget

Add this script to your website:

```html
<script
  src="https://convs-widget.vercel.app/widget.js"
  data-organization-id="YOUR_ORG_ID"
  data-position="bottom-right"
  async
></script>
```

Optional global API:

```js
window.ConvsWidget.show();
window.ConvsWidget.hide();
window.ConvsWidget.destroy();
window.ConvsWidget.init({ organizationId: "YOUR_ORG_ID" });
```

## Environment Variables

Set env per app as needed:

- `apps/web/.env.local`
  - `NEXT_PUBLIC_CONVEX_URL`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `SENTRY_AUTH_TOKEN` (optional)
- `apps/widget/.env.local`
  - `NEXT_PUBLIC_CONVEX_URL`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- `packages/backend/.env`
  - `CONVEX_DEPLOYMENT`
  - `CONVEX_URL`
  - `CLERK_*`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `COHERE_API_KEY`, `AWS_*` as required by integrations

## Build Notes

- `apps/embed` build outputs `dist/widget.js` and auto-copies it to `apps/widget/public/widget.js`.
- Embed config can override the widget URL via `VITE_WIDGET_URL` in `apps/embed/config.ts`.

## Project Notes

- The FAQ/knowledge base lives in `apps/embed/context.txt` for default widget content.
- Widget screens include: selection, chat, inbox, voice, auth, contact, loading, error.
