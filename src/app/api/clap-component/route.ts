import { prisma } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const sesssion = await getSession();
  const userId = sesssion?.user?.email;
  if (!userId) throw new Error("No user is signed in");
  try {
    const { storyId, commentId } = await request.json();
    const storyExist = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });
    if (!storyExist) {
      throw new Error("No Stories were found to clap");
    }
    const clapped = await prisma.clap.findFirst({
      where: {
        storyId,
        userId,
        commentId,
      },
    });

    if (clapped && clapped.clapCount < 50) {
      await prisma.clap.update({
        where: {
          id: clapped.id,
        },
        data: {
          clapCount: clapped.clapCount + 1,
        },
      });

      return NextResponse.json("Clap updated!");
    } else {
      const clapStory = await prisma.clap.create({
        data: {
          userId,
          storyId: storyExist.id,
          clapCount: 1,
          commentId,
        },
      });
      return NextResponse.json("Clap created");
    }
  } catch (error) {
    console.log("Error clapping the story", error);
    return NextResponse.error();
  }
}
