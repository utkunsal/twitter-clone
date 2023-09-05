import { getUserLikes } from "@/lib/actions/user.actions";
import { TweetCard } from "../cards/TweetCard";
import Link from "next/link";

interface Props {
  currentUserId: string,
  accountId: string,
}

export default async function LikesTab({ currentUserId, accountId }: Props){
  const response = await getUserLikes(accountId);

  return(
    <section className="mt-5 flex flex-col gap-3">
      {response.map(( tweet: any ) => (
        <div key={tweet._id}>
          {tweet.parent && 
            <Link href={`/tweet/${tweet.parent._id}`}>
              <p className="text-small-regular p-2 px-4 mt-0.5 -mb-3 text-gray-400 bg-dark-2">
                Replying to 
                <span className="text-[#0099FF] ml-1.5">
                  @{tweet.parent.author.username}
                </span>
              </p>
            </Link>
          }
          <TweetCard 
            key={tweet._id}
            id={tweet._id}
            currentUserId={currentUserId}
            content={tweet.text}
            image={tweet.image}
            author={tweet.author}
            comunity={tweet.community}
            createdAt={tweet.createdAt}
            replies={[]} 
            hideLine
          />
        </div>
      ))}
    </section>
  )
}