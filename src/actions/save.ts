"use server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "./user";

export const checkedSaved = async (storyId: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("No user is signed in");
  try {
    const saved = await prisma.save.findFirst({
      where: {
        storyId,
        userId,
      },
    });
    return saved ? true : false;
  } catch (error) {
    return false;
  }
};
