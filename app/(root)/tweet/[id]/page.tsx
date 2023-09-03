import { TweetCard } from "@/components/cards/TweetCard";
import Reply from "@/components/forms/Reply";
import { getTweetById } from "@/lib/actions/tweet.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id)
    return null

  const user = await currentUser();
  if (!user)
    return null 

  const [userInfo, tweet] = await Promise.all([
    getUser(user.id),
    getTweetById(params.id)
  ])

  if (!userInfo?.onboarded) 
    redirect("/onboarding")
  
  const parent = tweet.parentId ? await getTweetById(tweet.parentId) : null

  return(
    <section className="relative">
      <>
        {parent && 
          <>
            <TweetCard 
            key={parent._id}
            id={parent._id}
            currentUserId={user?.id || ""}
            parentId={parent.parentId}
            content={parent.text}
            image={parent.image}
            author={parent.author}
            comunity={parent.community}
            createdAt={parent.createdAt}
            replies={[]} 
          />
          <p className="text-small-regular p-2 px-4 mt-0.5 -mb-3 text-gray-400 bg-dark-2">
            Replying to 
            <Link href={`/profile/${parent.author.id}`} className="text-[#0099FF] ml-1.5">
              @{parent.author.username}
            </Link>
          </p>
        </>
        }
        <TweetCard 
          key={tweet._id}
          id={tweet._id}
          currentUserId={user?.id || ""}
          parentId={tweet.parentId}
          content={tweet.text}
          image={tweet.image}
          author={tweet.author}
          comunity={tweet.community}
          createdAt={tweet.createdAt}
          replies={tweet.children} 
        />
      </>
      <div className="mt-7">
        <Reply 
          tweetId={tweet.id}
          currentUserId={JSON.stringify(userInfo._id)}
          replyingTo={tweet.author.username}
        />
      </div>
      <div className="mt-7">
        {tweet.children.map((childTweet: any) => (
          <TweetCard 
          key={childTweet._id}
          id={childTweet._id}
          currentUserId={user?.id || ""}
          parentId={childTweet.parentId}
          content={childTweet.text}
          image={childTweet.image}
          author={childTweet.author}
          comunity={childTweet.community}
          createdAt={childTweet.createdAt}
          replies={childTweet.children} 
          isReply={true}
        />
        ))}
      </div>
    </section>
  )
}