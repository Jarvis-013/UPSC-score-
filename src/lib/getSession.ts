import prisma from "@/lib/prisma";

export async function getSessionUser() {
  // Try to find the seeded admin user
  let mockUser = await prisma.user.findFirst({
    where: { email: "admin@upsc.com" },
  });

  // If no user exists, create a default guest admin
  if (!mockUser) {
    mockUser = await prisma.user.create({
      data: {
        id: "mock-admin-id",
        name: "Guest Admin",
        email: "admin@upsc.com",
        password: "mock-password-not-needed",
        role: "ADMIN",
      },
    });
  }

  return {
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    },
  };
}
