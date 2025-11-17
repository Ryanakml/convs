import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isOrganizationRoute = createRouteMatcher([
  "/org-selection(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  if (!isPublicRoute(req)) {
    auth.protect();
  }
  if (userId && !orgId && !isOrganizationRoute(req)) {
    const searchParams = new URLSearchParams({ redirectUrl: req.url });
    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      req.url
    );
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
