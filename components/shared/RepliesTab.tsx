import { getUserReplies } from "@/lib/actions/user.actions"
import { TweetCard } from "../cards/TweetCard";

interface Props {
  currentUserId: string,
  accountId: string,
}

export default async function TweetsTab({ currentUserId, accountId }: Props){
  const response = await getUserReplies(accountId);

  return(
    <section className="mt-5 flex flex-col">
      {response.tweets.map(( tweet: any ) => (
        <div key={tweet._id}>
          {tweet.parent && 
            <>
              <TweetCard 
              key={tweet.parent._id}
              id={tweet.parent._id}
              currentUserId={currentUserId}
              content={tweet.parent.text}
              image={tweet.parent.image}
              author={tweet.parent.author}
              comunity={tweet.parent.community}
              createdAt={tweet.parent.createdAt}
              replies={[]} 
              isReply
              className="-mb-1"
            />
          {/*  <p className="text-small-regular p-2 px-4 mt-0.5 -mb-1 text-gray-400">
              Replying to 
              <Link href={`/profile/${tweet.parent.author.id}`} className="text-[#0099FF] ml-1.5">
                @{tweet.parent.author.username}
              </Link>
            </p> */}
          </>
          }
          <TweetCard 
            key={tweet._id}
            id={tweet._id}
            currentUserId={currentUserId}
            content={tweet.text}
            image={tweet.image}
            author={{ id: response.id, image: response.image, name: response.name, username: response.username }}
            comunity={tweet.community}
            createdAt={tweet.createdAt}
            replies={tweet.children} 
            isReply
            hideLine
          />
          <div className='mt-4 mb-6 h-0.5 w-full bg-light-2 bg-opacity-20' />
        </div>
      ))}
    </section>
  )
}