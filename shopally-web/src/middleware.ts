// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const res = NextResponse.next();

    const deviceId = req.cookies.get("deviceId")?.value;
    if (!deviceId) {
      const newId = crypto.randomUUID();
      res.cookies.set("deviceId", newId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // keep check
    },
    pages: {
      signIn: "/signin", // 👈 redirect here instead of 404
    },
  }
);

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
