import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSession";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paperType, set, responses } = await req.json();

    if (!paperType || !set || !responses || !Array.isArray(responses)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // Upsert Attempt - we don't calculate score here anymore
    const attempt = await prisma.examAttempt.upsert({
      where: {
        userId_paperType_set: {
          userId: session.user.id,
          paperType,
          set,
        },
      },
      update: {
        responses: JSON.stringify(responses),
      },
      create: {
        userId: session.user.id,
        paperType,
        set,
        responses: JSON.stringify(responses),
      },
    });

    return NextResponse.json({ message: "Responses saved successfully", attemptId: attempt.id });
  } catch (error) {
    console.error("Evaluate error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
