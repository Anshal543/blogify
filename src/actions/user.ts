import { auth } from "@/auth";
import { getSession } from "@/lib/get-session";

export const getCurrentUserId = async () =>{
   const session  = await getSession()
   const userId = session?.user?.email
   if(!userId){
     throw new Error("No userId is found in")
   }
    return userId
}

export const getCurrentUser = async () =>{
    const session = await getSession()
    if(!session?.user){
        throw new Error("No user is signed in")
    }
    return session?.user
}

export const getUser = async (userId:string) =>{
    const session = await getSession()
    if(!session?.user){
        throw new Error("No user is signed in")
    }
    return session?.user
}