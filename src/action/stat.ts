"use server";
import { getUser } from "@/auth/server";
import { prisma } from "@/prisma/prisma";
import { subDays } from "date-fns";

export async function HasName() {
  const user = await getUser();
  const data = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });
  return data;
}
export async function SetName(name: string, weight: number) {
  try {
    const user = await getUser();
    if (!user) {
      return { errMsg: "User not found" };
    }
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name,
        weight: weight,
      },
    });
    return { errMsg: null };
  } catch (error) {
    return { errMsg: error };
  }
}

export async function getBestExercise() {
  const user = await getUser();
  const ninetyDaysAgo = subDays(new Date(), 90);
  const exercises = await prisma.exercise.findMany({
    where: {
      workout: {
        userId: user?.id,
        date: {
          gte: ninetyDaysAgo,
        },
      },
    },
    include: {
      workout: {
        select: {
          date: true,
        },
      },
    },
  });

  const exerciseMap = new Map<
    string,
    {
      sets: number;
      reps: number;
      weight: number;
      date: Date;
      score: number;
    }
  >();

  exercises.forEach((exercise) => {
    let score;
    if (exercise.weight === 0) {
      score = exercise.sets * exercise.reps;
    } else {
      score = exercise.weight * exercise.reps * exercise.sets;
    }
    const currentBest = exerciseMap.get(exercise.name);
    if (!currentBest || score > currentBest.score) {
      exerciseMap.set(exercise.name, {
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        date: exercise.workout.date,
        score: score,
      });
    }
  });

  const result = Array.from(exerciseMap.entries()).map(
    ([exerciseName, data]) => ({
      name: exerciseName,
      sets: data.sets,
      reps: data.reps,
      weight: data.weight,
      date: data.date,
      score: data.score,
    }),
  );
  return result;
}

export async function workoutDates() {
  const user = await getUser();
  const dates = await prisma.workout.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      date: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return dates;
}
