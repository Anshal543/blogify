import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/get-session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const userId = session?.user?.email;

  if (!userId) {
    throw new Error("No user is signed in");
  }

  try {
    const NewStory = await prisma.story.create({
      data: {
        authorId: userId,
      },
    });

    return NextResponse.json(NewStory);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const session = await getSession();
  const userId = session?.user?.email;
  if (!userId) {
    throw new Error("No user is signed in");
  }
  const { storyId, content } = body;
  if (!storyId || !content) {
    throw new Error("Missing fields");
  }
  console.log(storyId);

  const Story = await prisma.story.findUnique({
    where: {
      id: storyId,
    },
  });

  if (!Story) {
    throw new Error("No story were found");
  }
  try {
    await prisma.story.update({
      where: {
        id: storyId,
      },
      data: {
        content,
      },
    });
    return NextResponse.json("successfully saved the story");
  } catch (error) {
    return NextResponse.error();
  }
}
