"use server";

import { getUser } from "@/auth/server";
import { handleErr } from "./handlerr";
import { prisma } from "@/prisma/prisma";

interface Workout {
  id: string;
  name: string;
  reps: number;
  sets: number;
  weight: number;
}

export const LoggingWorkout = async (
  workoutId: string,
  workoutData: Workout[],
) => {
  try {
    const user = await getUser();
    if (!user) {
      return { errMsg: "User not found" };
    }

    await prisma.workout.create({
      data: {
        id: workoutId,
        userId: user.id,
        date: new Date(),
        exerciseLog: {
          create: workoutData.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight || 0,
          })),
        },
      },
    });
    return { errMsg: null };
  } catch (error) {
    return handleErr(error);
  }
};

export const getWorkoutByYear = async (year: number) => {
  const user = await getUser();

  const workouts = await prisma.workout.findMany({
    where: {
      userId: user?.id,
      date: {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31),
      },
    },
    include: {
      exerciseLog: true,
    },
  });

  const dateMap = new Map<string, { date: Date; workouts: typeof workouts }>();
  workouts.forEach((workout) => {
    const dateKey = workout.date.toDateString();
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { date: workout.date, workouts: [] });
    }
    dateMap.get(dateKey)!.workouts.push(workout);
  });
  return dateMap;
  // const result = Array.from(dateMap.values()).map((entry) => ({
  //   date: entry.date,
  //   workouts: entry.workouts.map((workout) => ({
  //     exerciseLog: workout.exerciseLog,
  //   })),
  // }));
  // return result;
};
