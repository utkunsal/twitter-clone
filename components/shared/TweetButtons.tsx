"use client"

import { likeTweet, removeLikeTweet } from "@/lib/actions/tweet.actions";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Props { 
  tweetId: string, 
  currentUserId: string, 
  liked: boolean,
  likeCount?: number,
  replyCount: number | null,
}

export default function TweetButtons({ 
  tweetId, 
  currentUserId, 
  liked, 
  likeCount,
  replyCount 
}: Props){
  const [like, setLike] = useState(liked)
  const pathname = usePathname()

  const handleRepostClick = () => {

  };

  const handleLikeClick = async () => {
    like ?
    await removeLikeTweet({ tweetId: JSON.parse(tweetId), currentUserId, path: pathname })
    :
    await likeTweet({ tweetId: JSON.parse(tweetId), currentUserId, path: pathname })
    setLike(!like)
  };

  return(
    <div className="flex items-center gap-10 mt-3">
    <Link href={`/tweet/${JSON.parse(tweetId)}`} className="flex-row flex">
      <Image
        src="/assets/reply.svg"
        alt="reply"
        width={20}
        height={20}
        className="opacity-70 cursor-pointer object-contain" 
      />
      <span className="text-subtle-medium text-light-2 opacity-50 px-2">
        {replyCount}
      </span>
    </Link>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
        src="/assets/repost.svg"
        alt="repost"
        width={20}
        height={20}
        className="opacity-70 cursor-pointer object-contain" 
      />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!text-subtle-medium bg-dark-2 text-light-2 border-gray-500 shadow-black shadow-lg">
        <DropdownMenuItem className="h-7 w-15 cursor-pointer">
          <span>Retweet</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-7 w-15 cursor-pointer">
          <Link href={`/create-tweet/quote/${JSON.parse(tweetId)}`}>Quote Tweet</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {like ? 
      <Image
      src="/assets/heart-fill.svg"
      alt="heart"
      width={20}
      height={20}
      className="opacity-90 cursor-pointer object-contain" 
      id="heart-icon"
      onClick={handleLikeClick}
    />
    :
    <Image
      src="/assets/heart.svg"
      alt="heart"
      width={20}
      height={20}
      className="opacity-70 cursor-pointer object-contain" 
      id="heart-icon"
      onClick={handleLikeClick}
    />}
    <span className="text-subtle-medium text-light-2 -ml-10 mb-1 opacity-50 px-2">
      {likeCount}
    </span>
  </div>
  )
}