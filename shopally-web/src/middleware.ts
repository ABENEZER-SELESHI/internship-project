// middleware.ts
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent } from "next/server";

const authMiddleware = withAuth(
  function middleware(req: NextRequestWithAuth) {
    const res = NextResponse.next();

    // ✅ Add deviceId cookie if missing
    const deviceId = req.cookies.get("deviceId")?.value;
    if (!deviceId) {
      const newId = crypto.randomUUID();
      res.cookies.set("deviceId", newId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only allow if logged in
    },
  }
);

export function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
  const res = authMiddleware(req, event);

  // 👇 Handle unauthorized case (App Router doesn’t use pages.signIn)
  if (res instanceof NextResponse && res.status === 401) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/comparison",
    "/saved-items",
    "/profile",
    "/how-it-works",
  ],
};
