import { TweetCard } from "@/components/cards/TweetCard";
import Reply from "@/components/forms/Reply";
import { getTweetById, getAllParentTweets } from "@/lib/actions/tweet.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
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
  
  const parent = tweet.parent ?? null

  if(parent)
    parent.parent = parent.parent ? await getAllParentTweets(parent._id) : null


  const renderParentTweets = (data: any): React.ReactNode => {
    if (data.parent) {
      return (
        <div key={data.parent._id}>
          {renderParentTweets(data.parent)}
          <TweetCard 
            key={data.parent._id}
            id={data.parent._id}
            currentUserId={user?.id || ""}
            content={data.parent.text}
            image={data.parent.image}
            author={data.parent.author}
            createdAt={data.parent.createdAt}
            replies={data.parent.children} 
            className="-mt-5 -mb-7"
            likeCount={data.parent.likeCount ?? 0}
          />
        </div>
      );
    }
  }

  return(
    <section className="relative">
      <>
        {parent && 
          <>
            {parent.parent && renderParentTweets(parent)}
            <TweetCard 
            key={parent._id}
            id={parent._id}
            currentUserId={user?.id || ""}
            content={parent.text}
            image={parent.image}
            author={parent.author}
            createdAt={parent.createdAt}
            replies={parent.children} 
            repost={parent.repost}
            className="-mt-5"
            hideTotalReplyCount
            likeCount={parent.likeCount ?? 0}
            />
          </>
        }
        <TweetCard 
          key={tweet._id}
          id={tweet._id}
          currentUserId={user?.id || ""}
          content={tweet.text}
          image={tweet.image}
          author={tweet.author}
          createdAt={tweet.createdAt}
          replies={tweet.children} 
          className="-mt-7"
          hideLine={tweet.children.length === 0}
          repost={tweet.repost}
          likeCount={tweet.likeCount ?? 0}
        />
      </>
      <div className="mb-4 -mt-7">
        <Reply 
          tweetId={tweet.id}
          currentUserId={JSON.stringify(userInfo._id)}
          replyingTo={tweet.author.username}
        />
      </div>
      <>
        {tweet.children.map((childTweet: any, index: number) => (
          <div key={childTweet._id}>
            {<p key={childTweet._id} className="text-small-regular p-2 px-4 mt-0.5 -mb-1 text-gray-400 ">
              Replying to 
              <Link href={`/profile/${tweet.author.id}`} className="text-[#0099FF] ml-1.5">
                @{tweet.author.username}
              </Link>
            </p>}
            <TweetCard 
              key={childTweet._id}
              id={childTweet._id}
              currentUserId={user?.id || ""}
              content={childTweet.text}
              image={childTweet.image}
              author={childTweet.author}
              createdAt={childTweet.createdAt}
              replies={childTweet.children} 
              isReply
              hideLine={!childTweet.children.length}
              likeCount={childTweet.likeCount ?? 0}
            />
            {childTweet.children.slice(0, 1).map((childOfChildTweet: any, index: number) => (
                <TweetCard 
                  key={childOfChildTweet._id}
                  id={childOfChildTweet._id}
                  currentUserId={user?.id || ""}
                  content={childOfChildTweet.text}
                  image={childOfChildTweet.image}
                  author={childOfChildTweet.author}
                  createdAt={childOfChildTweet.createdAt}
                  replies={childOfChildTweet.children} 
                  isReply
                  hideTotalReplyCount
                  hideLine={childOfChildTweet.children.length === 0}
                  className="-mt-1"
                  likeCount={childOfChildTweet.likeCount ?? 0}
                />
              ))}
              {childTweet.children.length > 1 && (
                <div className='px-7 py-4 -mt-3 flex items-center gap-2'>
                  {childTweet.children.slice(1, 5).map((childOfChildTweet: any, index: any) => (
                    <Image
                      key={index}
                      src={childOfChildTweet.author.image}
                      alt="Profile image"
                      width={30}
                      height={30}
                      className={`${index !== 0 && "-ml-6"} rounded-full object-cover`}
                    />
                  ))}
                  <Link href={`/tweet/${childTweet._id}`}>
                    <p className='text-subtle-medium text-light-2 opacity-50 mt-0.5 ml-1'>
                      {childTweet.children.length - 1} more repl{childTweet.children.length - 1 === 1 ? "y" : "ies"}
                    </p>
                  </Link>
                </div>
              )}  
            <div className='mt-4 mb-3 h-0.5 w-full bg-light-2 bg-opacity-20' />
          </div>
        ))}
      </>
    </section>
  )
}