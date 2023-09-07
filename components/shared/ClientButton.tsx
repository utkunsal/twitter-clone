"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { followUser, unfollowUser } from "@/lib/actions/user.actions"
import { usePathname } from "next/navigation"
import { deleteTweet } from "@/lib/actions/tweet.actions"
import Image from "next/image"

interface Params { 
  type: string, 
  targetUserObjectId?: string,
  currentUserId: string,
  following?: boolean,
  tweetId?: string
}

export default function ClientButton({ 
  type, 
  following,
  targetUserObjectId,
  currentUserId,
  tweetId,
}: Params){
  const [state, setState] = useState(type === "follow" ? following : false)
  const path = usePathname()
  
  if (type !== "follow" && type !== "delete")
    return null
  
  const handleOnClick = async () => {
    if (type === "follow" && targetUserObjectId){
      (following ? await unfollowUser({ targetUserObjectId: JSON.parse(targetUserObjectId), currentUserId, path }) : await followUser({ targetUserObjectId: JSON.parse(targetUserObjectId), currentUserId, path }))
    } else if (type === "delete"){
      if (!state)
        setState(true)
      else if (tweetId)
        await deleteTweet({ tweetId: JSON.parse(tweetId), currentUserId, path })
    }
  }

  return(
    <Button onClick={handleOnClick} className={`${type === "delete" && `h-6 mt-2.5 text-subtle-medium !text-gray-200 !border-neutral-600 ${!state && "border-none"}`} bg-dark-2 border-gray-500 border hover:bg-zinc-900`}>
      {type === "follow" ? (following ? "Following" : "Follow") : (state ? "Confirm delete?" : 
      <Image
        src="/assets/delete.svg"
        alt="reply"
        width={20}
        height={20}
        className="opacity-50 cursor-pointer object-contain" 
      />)}
    </Button>
  )
}