"use server";
import { createClient } from "@/auth/server";
import { prisma } from "@/prisma/prisma";
import { handleErr } from "./handlerr";

export async function loginAction(email: string, password: string) {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw error;
    return { errMsg: null };
  } catch (error) {
    console.log(error);
    return handleErr(error);
  }
}

export async function signupAction(email: string, password: string) {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({
      email: email,
      password: password,
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("User ID not found");

    await prisma.user.create({
      data: {
        id: userId,
        email: email,
        name: email.split("@")[0], // Assuming name is derived from email
        age: 0, // Default value, replace with actual logic if needed
        height: 0, // Default value, replace with actual logic if needed
        weight: 0, // Default value, replace with actual logic if needed
      },
    });

    return { errMsg: null };
  } catch (error) {
    console.log(error);
    return handleErr(error);
  }
}
export const logoutAction = async () => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();

    if (error) throw error;

    return { errMsg: null };
  } catch (error) {
    return handleErr(error);
  }
};
