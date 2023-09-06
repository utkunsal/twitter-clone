import Image from "next/image"
import Link from "next/link"
import TweetButtons from "@/components/shared/TweetButtons"
import { isLiked } from "@/lib/actions/tweet.actions"
import ClientButton from "@/components/shared/ClientButton"
import { formatDateString } from "@/lib/utils"

interface Props {
  id: string,
  currentUserId: string,
  content: string,
  image: string | null,
  author: {
    id: string,
    name: string,
    username: string
    image: string,
  },
  createdAt: string,
  replies: {
    author: {
      image: string,
    }
  }[],
  likeCount?: number,
  repost?: {
    id: string,
    text: string,
    image: string | null,
    author: {
      id: string,
      name: string,
      username: string
      image: string,
    },
    createdAt: string,
  }
  isReply?: boolean,
  hideTotalReplyCount?: boolean,
  hideLine?: boolean,
  hideButtons?: boolean,
  isRepost?: boolean,
  className?: string,
}

export async function TweetCard ({
  id,
  currentUserId,
  content,
  image,
  author,
  createdAt,
  likeCount,
  replies,
  repost,
  isReply,
  hideTotalReplyCount,
  hideLine,
  hideButtons,
  isRepost,
  className,
}: Props) {

  const isLikedByCurrentUser = await isLiked({ tweetId: id, currentUserId })

  return(
    <article className={`${className} flex flex-col rounded w-full ${isRepost && "py-2 px-2"} ${isReply ? "py-2 pb px-5" : "bg-dark-2 p-5"}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-1 flex-row w-full gap-4">
          
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image 
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            {!hideLine && <div className="tweet-card_bar" />}
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full justify-between">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="flex cursor-pointer text-base-semibold text-light-1 gap-1.5">
                  {author.name}<span className="text-small-medium opacity-50">@{author.username}</span>
                </h4>
              </Link>
              {!isRepost && <span className="text-small-regular text-light-1 opacity-50">{formatDateString(createdAt)}</span>}
            </div>
            <Link href={`/tweet/${id}`} className="cursor-pointer">
              <p className={`${isRepost ? "mt-1" : "mt-2"} text-small-regular text-light-2`}>
                {content}
              </p>

              {image && <Image 
                src={image}
                alt="Image of the post"
                width={0}
                height={0}
                sizes="100vw"
                className={`pt-3 w-full h-auto object-cover max-h-[28rem] ${isReply && "max-w-[18rem]"}`}
              />} 
            </Link>

            {repost && 
              <TweetCard 
                key={repost.id}
                id={repost.id}
                currentUserId={currentUserId}
                content={repost.text}
                image={repost.image}
                author={repost.author}
                createdAt={repost.createdAt}
                replies={[]} 
                hideLine
                hideButtons
                hideTotalReplyCount
                isRepost
                className="border border-neutral-600 rounded-lg mt-1.5"
              />
            }

            {!hideButtons && 
              <div className="flex flex-row items-center justify-between">
                <TweetButtons 
                  tweetId={JSON.stringify(id)} 
                  currentUserId={currentUserId} 
                  liked={isLikedByCurrentUser ?? false}
                  replyCount={!hideTotalReplyCount && !isReply && replies.length !== 0 ? null : replies.length}
                  likeCount={likeCount}
                />
             {/*  {currentUserId === author.id && 
                  <ClientButton
                    type="delete"
                    currentUserId={currentUserId}
                    tweetId={JSON.stringify(id)}
                  />
                } */}
              </div>
            }
          </div>
        </div>

      </div>
      {!hideTotalReplyCount && !isReply && replies.length !== 0 && (
        <div className='ml-3 mt-3 flex items-center gap-2'>
          {replies.slice(0, 3).map((childTweet, index) => (
            <Image
              key={index}
              src={childTweet.author.image}
              alt="Profile image"
              width={20}
              height={20}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}
          <Link href={`/tweet/${id}`}>
            <p className='text-subtle-medium text-light-2 opacity-50'>
              {replies.length} repl{replies.length === 1 ? "y" : "ies"}
            </p>
          </Link>
        </div>
      )}
    </article>
  )
}