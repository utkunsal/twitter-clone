import { getUserTweets } from "@/lib/actions/user.actions"
import { TweetCard } from "../cards/TweetCard";

interface Props {
  currentUserId: string,
  accountId: string,
  accountType: string,
}

export default async function TweetsTab({ currentUserId, accountId, accountType }: Props){
  const response = await getUserTweets(accountId);

  return(
    <section className="mt-5 flex flex-col gap-3">
      {response.tweets.map(( tweet: any ) => (
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
          hideLine={!tweet.children.length}
        />
      ))}
    </section>
  )
}