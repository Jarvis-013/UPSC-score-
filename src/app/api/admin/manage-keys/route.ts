import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

// Ensure only admins can access (for demonstration we allow anyone logged in, but you can check role)
async function authorizeAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const institute = searchParams.get("institute");
  const paperType = searchParams.get("paperType");
  const set = searchParams.get("set");

  if (!institute || !paperType || !set) {
    return NextResponse.json({ message: "Missing query parameters" }, { status: 400 });
  }

  try {
    const keys = await prisma.answerKey.findMany({
      where: { institute, paperType, set },
      orderBy: { questionNum: "asc" },
    });
    return NextResponse.json({ keys });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await authorizeAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { institute, paperType, set } = await req.json();
    if (!institute || !paperType || !set) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    await prisma.answerKey.deleteMany({
      where: { institute, paperType, set },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await authorizeAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { institute, paperType, set, keys, newInstitute } = await req.json();
    if (!institute || !paperType || !set || !Array.isArray(keys)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const targetInstitute = newInstitute && newInstitute.trim() !== "" ? newInstitute.trim() : institute;

    // Since we need to update multiple rows, doing it in a transaction
    await prisma.$transaction(
      keys.map((k: any) =>
        prisma.answerKey.update({
          where: {
            institute_paperType_set_questionNum: {
              institute,
              paperType,
              set,
              questionNum: parseInt(k.questionNum),
            },
          },
          data: {
            answer: k.answer.toUpperCase(),
            institute: targetInstitute,
          },
        })
      )
    );

    return NextResponse.json({ message: "Keys updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
