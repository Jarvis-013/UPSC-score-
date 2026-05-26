import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function getSessionUser() {
  // 1. Check if there is an active logged-in session (e.g., an Admin)
  const session = await getServerSession(authOptions);
  if (session) {
    return session;
  }

  // 2. Otherwise, automatically fallback to a mock "Guest Candidate" (with USER role)
  // to avoid requiring logins or OTP for standard exam evaluations
  let guestUser = await prisma.user.findFirst({
    where: { email: "guest@upsc.com" },
  });

  if (!guestUser) {
    guestUser = await prisma.user.create({
      data: {
        id: "guest-candidate-id",
        name: "Guest Candidate",
        email: "guest@upsc.com",
        password: "guest-password-not-needed",
        role: "USER",
      },
    });
  }

  return {
    user: {
      id: guestUser.id,
      name: guestUser.name,
      email: guestUser.email,
      role: guestUser.role,
    },
  };
}
