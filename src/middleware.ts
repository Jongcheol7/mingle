import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// app 하위 protected 폴더가 있을때 /protected/abc 등 url로 들어간다면 clerk 인증을 거치도록 하는 역할
const isProtectedRoute = createRouteMatcher(["/protected(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
