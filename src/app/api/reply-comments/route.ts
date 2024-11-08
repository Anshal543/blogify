import {prisma} from "@/lib/db"
import { getSession } from "@/lib/get-session"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest){
    const session = await getSession()
    const userId = session?.user?.email
    if(!userId) throw new Error ('No user found')

    try {
        const body = await request.json()
        const {storyId, content, parentCommentId} = body

        if(!storyId || !content || !parentCommentId){
            throw new Error('Insuficient data')
        }

        const existingStory = await prisma.story.findUnique({
            where:{
                id:storyId
            }
        })

        if(!existingStory){
            throw new Error('No stories were found to comment')
        }

        const newComment = await prisma.comment.create({
            data:{
                userId,
                storyId,
                parentCommentId,
                content:content
            }
        })

        return NextResponse.json('Successfully commented on story')
    } catch (error) {
        console.log("Error in commenting", error)
        return NextResponse.error()
    }
}