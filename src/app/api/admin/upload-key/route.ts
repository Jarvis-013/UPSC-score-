import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSession";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { institute, paperType, set, keys } = await req.json();

    if (!institute || !paperType || !set || !keys || !Array.isArray(keys)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // Delete existing keys for this institute, paperType, and set
    await prisma.answerKey.deleteMany({
      where: {
        institute,
        paperType,
        set,
      },
    });

    // Insert new keys
    const dataToInsert = keys.map((k: any) => ({
      institute,
      paperType,
      set,
      questionNum: parseInt(k.questionNum),
      answer: k.answer.toUpperCase(),
    }));

    await prisma.answerKey.createMany({
      data: dataToInsert,
    });

    return NextResponse.json({ message: "Answer keys uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
