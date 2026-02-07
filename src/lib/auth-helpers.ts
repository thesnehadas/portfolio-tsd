import { getSession as getAuthSession, requireAuth as requireAuthSession } from "./auth-simple";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-change-this-in-production"
);

export async function getSession() {
  return await getAuthSession();
}

export async function requireAuth() {
  try {
    return await requireAuthSession();
  } catch {
    redirect("/admin/login");
  }
}

// For API routes - reads cookies from request object (avoids redirect issues)
export async function getSessionFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
      },
    };
  } catch {
    return null;
  }
}

// For API routes - throws error instead of redirecting
export async function requireAuthAPI(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}