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
