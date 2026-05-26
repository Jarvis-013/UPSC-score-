import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSession";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paperType = searchParams.get("paperType");
    const set = searchParams.get("set");

    if (!paperType || !set) {
      return NextResponse.json({ message: "Missing params" }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: {
        userId_paperType_set: {
          userId: session.user.id,
          paperType,
          set,
        },
      },
    });

    if (attempt) {
      return NextResponse.json({ attempt });
    } else {
      return NextResponse.json({ attempt: null });
    }
  } catch (error) {
    console.error("Fetch attempt error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
