"use client"
import React, { useEffect, useState } from 'react'

type Props = {
  storyId: string
  clapCount: number
  userClaps: number
  commentId?: string
}

const ClapComponent = ({storyId,clapCount,commentId,userClaps}: Props) => {
  const [currentClapByUser, setCurrentClapByUser] = useState<number>(userClaps)
  const [currentClaps, setCurrentClaps] = useState<number>(clapCount)
  const [showPopup, setShowPopUp] = useState<boolean>(false)

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setShowPopUp(false)
    },1000)
    return ()=>{
      clearTimeout(timeout)
    }
  },[showPopup])

  const clapStoryOrComment = async () => {
    if(currentClapByUser >=50){
      setShowPopUp(true)
      return
    }
    setCurrentClapByUser(currentClapByUser+1)
    setShowPopUp(true)
    try {
      if(!commentId){
        await fetch(`/api/clap`,{
          method:'POST',
          body:JSON.stringify(storyId)
        })
      } else{
        await fetch(`/api/clap`,{
          method:'POST',
          body:JSON.stringify({storyId,commentId})
        })
      }
    } catch (error) {
      
    }
  }

  return (
    <div>
      {clapCount}
      {userClaps}
    </div>
  )
}

export default ClapComponent