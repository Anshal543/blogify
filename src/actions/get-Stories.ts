"use server";
import { prisma } from "@/lib/db";

export async function getStoryById(storyId: string) {
  if (!storyId) {
    throw new Error("No storyId provided");
  }
  try {
    const StoryById = await prisma.story.findUnique({
      where: {
        id: storyId,
        publish: false,
      },
    });

    return { response: StoryById };
  } catch (error) {
    return { error: "Error on getting the story by Id" };
  }
}
