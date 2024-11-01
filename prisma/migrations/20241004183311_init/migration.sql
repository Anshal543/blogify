-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL DEFAULT concat('story_',replace(cast(gen_random_uuid() as text),'-','')),
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "topics" TEXT[],
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);
