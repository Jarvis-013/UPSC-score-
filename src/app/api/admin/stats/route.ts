import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

async function authorizeAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user?.role === "ADMIN";
}

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const attempts = await prisma.examAttempt.findMany();
    const answerKeys = await prisma.answerKey.findMany();

    // Map answer keys by institute, paperType, set, questionNum
    const keyMap: Record<string, Record<number, string>> = {};
    answerKeys.forEach((key) => {
      const compositeKey = `${key.institute}-${key.paperType}-${key.set}`;
      if (!keyMap[compositeKey]) keyMap[compositeKey] = {};
      keyMap[compositeKey][key.questionNum] = key.answer;
    });

    const gsScores: number[] = [];
    const csatScores: number[] = [];

    attempts.forEach((att) => {
      const responses = JSON.parse(att.responses);
      
      // Standardize scoring using the "Official" key as baseline, or fallback to first matching key.
      let chosenCompositeKey = `Official-${att.paperType}-${att.set}`;
      if (!keyMap[chosenCompositeKey]) {
        const matchingKey = answerKeys.find(
          (k) => k.paperType === att.paperType && k.set === att.set
        );
        if (matchingKey) {
          chosenCompositeKey = `${matchingKey.institute}-${att.paperType}-${att.set}`;
        } else {
          return; // Skip scoring if no keys are uploaded
        }
      }

      const qMap = keyMap[chosenCompositeKey];
      let correct = 0;
      let wrong = 0;

      responses.forEach((res: any) => {
        const selected = res.selectedAnswer;
        if (selected !== "N") {
          const correctAns = qMap[res.questionNum];
          if (correctAns && selected === correctAns) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      const marksPerCorrect = att.paperType === "CSAT" ? 2.5 : 2.0;
      const penaltyPerWrong = att.paperType === "CSAT" ? 0.83 : 0.66;
      const rawScore = (correct * marksPerCorrect) - (wrong * penaltyPerWrong);
      const score = Math.round(rawScore * 100) / 100;

      if (att.paperType === "GS") {
        gsScores.push(score);
      } else {
        csatScores.push(score);
      }
    });

    const computeStats = (scores: number[]) => {
      if (scores.length === 0) return { count: 0, average: 0, high: 0, low: 0 };
      const sum = scores.reduce((a, b) => a + b, 0);
      const average = Math.round((sum / scores.length) * 100) / 100;
      const high = Math.max(...scores);
      const low = Math.min(...scores);
      return { count: scores.length, average, high, low };
    };

    const gsStats = computeStats(gsScores);
    const csatStats = computeStats(csatScores);

    // Score distribution bins
    const getDistribution = (scores: number[]) => {
      const bins = {
        "< 40": 0,
        "40-70": 0,
        "70-90": 0,
        "90-110": 0,
        "110-130": 0,
        "130-150": 0,
        "> 150": 0,
      };

      scores.forEach((s) => {
        if (s < 40) bins["< 40"]++;
        else if (s >= 40 && s < 70) bins["40-70"]++;
        else if (s >= 70 && s < 90) bins["70-90"]++;
        else if (s >= 90 && s < 110) bins["90-110"]++;
        else if (s >= 110 && s < 130) bins["110-130"]++;
        else if (s >= 130 && s < 150) bins["130-150"]++;
        else bins["> 150"]++;
      });

      return Object.entries(bins).map(([range, count]) => ({ range, count }));
    };

    const gsDistribution = getDistribution(gsScores);
    const csatDistribution = getDistribution(csatScores);

    return NextResponse.json({
      totalAttempts: attempts.length,
      gs: gsStats,
      csat: csatStats,
      gsDistribution,
      csatDistribution,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
