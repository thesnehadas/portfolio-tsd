import { getSession as getAuthSession, requireAuth as requireAuthSession } from "./auth-simple";
import { redirect } from "next/navigation";

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

// For API routes - throws error instead of redirecting
export async function requireAuthAPI() {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}