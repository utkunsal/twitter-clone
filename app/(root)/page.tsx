import { TweetCard } from "@/components/cards/TweetCard";
import { getTweets } from "@/lib/actions/tweet.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
 
export default async function Home() {
  const response = await getTweets(1, 30);
  const user = await currentUser()

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="flex flex-col mt-9 gap-10">
        {response.tweets.length !== 0 ?
          <>
            {response.tweets.map(tweet => (
              <>
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
                hideTotalReplyCount={true}
              />
              {tweet.children.slice(0, 2).map((childTweet: any) => (
                <div className="-mt-10 bg-dark-2">
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
                    hideTotalReplyCount={true}
                  />
                </div>
              ))}
              {tweet.children.length > 2 && (
                <div className='px-7 py-4 -mt-10 flex items-center gap-2 bg-dark-2 '>
                  {tweet.children.slice(2, 6).map((childTweet: any, index: any) => (
                    <Image
                      key={index}
                      src={childTweet.author.image}
                      alt="Profile image"
                      width={30}
                      height={30}
                      className={`${index !== 0 && "-ml-6"} rounded-full object-cover`}
                    />
                  ))}
                  <Link href={`/tweet/${tweet._id}`}>
                    <p className='text-subtle-medium text-light-2 opacity-50 mt-0.5 ml-2'>
                      {tweet.children.length - 2} more repl{tweet.children.length - 2 === 1 ? "y" : "ies"}
                    </p>
                  </Link>
                </div>
              )}  
              </>
            ))}
          </>
           : 
          <p className="no-result">No tweets</p>
        }
      </section>
    </>
  )
}