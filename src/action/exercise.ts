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
            weight: exercise.weight,
          })),
        },
      },
    });
    return { errMsg: null };
  } catch (error) {
    return handleErr(error);
  }
};
