import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function authorizeAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user?.role === "ADMIN";
}

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, newPassword, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (role) {
      dataToUpdate.role = role;
    }
    if (newPassword && newPassword.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Since Cascade Deletes aren't configured in SQLite automatically by default without prisma config,
    // let's manually delete the user's exam attempts first to avoid foreign key constraints.
    await prisma.examAttempt.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
