"use server"
import { prisma } from "@/lib/db";

export async function getAllComments(
  storyId: string,
  parentCommentId?: string
) {
  if (!storyId) throw new Error("No story id found");
  try {
    if (!parentCommentId) {
      const comments = await prisma.comment.findMany({
        where: {
          storyId,
          parentCommentId: null,
        },
        include: {
          Clap: true,
          replies: true
        },
      });
      return { response: comments };
    }
    const comments = await prisma.comment.findMany({
      where: {
        storyId,
        parentCommentId,
      },
      include: {
        Clap: true,
        replies: true
      },
    });
    return { response: comments };
  } catch (error) {
    console.log("Error in fetching comments", error);
  }
}
