import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ResultView from "./ResultView";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const attempt = await prisma.examAttempt.findUnique({
    where: { id },
  });

  if (!attempt || attempt.userId !== session.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Result Not Found</h2>
        </div>
      </div>
    );
  }

  const answerKeys = await prisma.answerKey.findMany({
    where: {
      paperType: attempt.paperType,
      set: attempt.set,
    },
  });

  const responses = JSON.parse(attempt.responses);

  return (
    <ResultView 
      attempt={attempt} 
      responses={responses} 
      answerKeys={answerKeys} 
    />
  );
}
