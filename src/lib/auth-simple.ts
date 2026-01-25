import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-change-this-in-production"
);

export async function signIn(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user[0]) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user[0].password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = await new SignJWT({ userId: user[0].id, email: user[0].email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  return { token, user: { id: user[0].id, email: user[0].email, name: user[0].name } };
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

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

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
