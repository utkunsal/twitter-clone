import { TweetCard } from "@/components/cards/TweetCard";
import { getTweets } from "@/lib/actions/tweet.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
 
export default async function Home() {
  const user = await currentUser()
  const response = await getTweets(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="flex flex-col mt-8 gap-8">
        {response.tweets.length !== 0 ?
          <>
            {response.tweets.map(tweet => (
              <div key={tweet._id} className="flex-col flex gap-10">
              <TweetCard 
                key={tweet._id}
                id={tweet._id}
                currentUserId={user?.id || ""}
                content={tweet.text}
                image={tweet.image}
                author={tweet.author}
                createdAt={tweet.createdAt}
                replies={tweet.children} 
                hideTotalReplyCount
                hideLine={!tweet.children.length}
                repost={tweet.repost}
                likeCount={tweet.likeCount ?? 0}
              />
              {tweet.children.slice(0, 1).map((childTweet: any, index: number) => (
                <div key={childTweet._id} className="-mt-[3.25rem] pb-3 bg-dark-2">
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
                    hideTotalReplyCount
                    hideLine={childTweet.children.length === 0}
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
                      hideLine
                      className="-mb-0.5 bg-dark-2"
                      likeCount={childOfChildTweet.likeCount ?? 0}
                    />
                ))}
                </div>
                
              ))}
              {tweet.children.length > 1 && (
                <div className='px-7 py-4 -mt-[3.75rem] flex items-center gap-2 bg-dark-2 '>
                  {tweet.children.slice(1, 5).map((childTweet: any, index: any) => (
                    <Image
                      key={index}
                      src={childTweet.author.image}
                      alt="Profile image"
                      width={30}
                      height={30}
                      className={`${index !== 0 && "-ml-8"} rounded-full object-cover`}
                    />
                  ))}
                  <Link href={`/tweet/${tweet._id}`}>
                    <p className='text-subtle-medium text-light-2 opacity-50 mt-0.5 ml-1'>
                      {tweet.children.length - 1} more repl{tweet.children.length - 1 === 1 ? "y" : "ies"}
                    </p>
                  </Link>
                </div>
              )}  
              </div>
            ))}
          </>
           : 
          <p className="no-result">No tweets</p>
        }
      </section>
    </>
  )
}