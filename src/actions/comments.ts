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

export const NumberOfComments = async (storyId: string) => {
  try {
    const commentNo = await prisma.comment.aggregate({
      where: {
        storyId,
      },
      _count: true,
    })
    return {response:commentNo._count};
  } catch (error) {
    return {error:"error in fetching total  comments"}
  }
}