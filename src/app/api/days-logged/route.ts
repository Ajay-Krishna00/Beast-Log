import { getUser } from "@/auth/server";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await getUser();
  const uniqueD = await prisma.workout.findMany({
    where: {
      userId: user?.id,
    },
    distinct: ["date"],
    select: {
      date: true,
    },
  });
  return NextResponse.json({ daysLogged: uniqueD.length });
};
