import { prisma } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const sesssion = await getSession();
  const userId = sesssion?.user?.email;
  if (!userId) throw new Error("No user is signed in");
  try {
    const { storyId } = await request.json();
    const storyExist = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });
    if (!storyExist) {
      throw new Error("No Stories were found to clap");
    }
    const savedCheck = await prisma.save.findFirst({
      where: {
        storyId,
        userId,
      },
    });

    if (savedCheck) {
      await prisma.save.delete({
        where: {
          id: savedCheck.id,
        }});

      return NextResponse.json("story removed from saved story");
    } else {
      const saveStory = await prisma.save.create({
        data: {
          userId,
          storyId: storyExist.id,
        },
      });
      return NextResponse.json(saveStory);
    }
  } catch (error) {
    console.log("Error", error);
    return NextResponse.error();
  }
}
