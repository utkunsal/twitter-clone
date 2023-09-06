import { TweetCard } from "@/components/cards/TweetCard"
import CreateTweet from "@/components/forms/CreateTweet"
import { getTweetById } from "@/lib/actions/tweet.actions"
import { getUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser()
  if (!user) 
    return null

    const [userInfo, tweetToQuote] = await Promise.all([
      getUser(user.id),
      getTweetById(params.id)
    ])

  if (!userInfo?.onboarded) 
    redirect("/onboarding")
  
  return(
    <>
      <h1 className="head-text mb-5">Quote Tweet</h1>
      <div className="flex flex-1 flex-row w-full gap-4">

          <div className="flex flex-col items-center">
            <Link href={`/profile/${userInfo.id}`} className="relative h-11 w-11">
              <Image 
                src={userInfo.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            {false && <div className="tweet-card_bar" />}
          </div>

          <div className="flex flex-col w-full">
            <Link href={`/profile/${userInfo.id}`} className="w-fit -mb-5">
              <h4 className="flex cursor-pointer text-base-semibold text-light-1 gap-1.5">
                {userInfo.name}<span className="text-small-medium opacity-50">@{userInfo.username}</span>
              </h4>
            </Link>

            <div className="-mt-10">
              <CreateTweet 
                userId={JSON.stringify(userInfo._id)}
                tweetToQuote={JSON.stringify(tweetToQuote._id)}
              />
      
              <TweetCard 
                key={tweetToQuote._id}
                id={tweetToQuote._id}
                currentUserId={user.id || ""}
                content={tweetToQuote.text}
                image={tweetToQuote.image}
                author={tweetToQuote.author}
                createdAt={tweetToQuote.createdAt}
                replies={tweetToQuote.children} 
                hideLine={!tweetToQuote.children.length}
                hideButtons
                className="border border-gray-500 rounded-xl mt-1"
              />
            </div>
          </div>
        
      </div>
    </>
  )
}