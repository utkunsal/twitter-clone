import Image from "next/image";
import Link from "next/link";
import ClientButton from "./ClientButton";
import { isFollowing } from "@/lib/actions/user.actions";

interface Props {
  accountId: string;
  authUserId: string;
  targetObjectId: string;
  name: string;
  username: string;
  imageUrl: string;
  bio: string;
  followingCount: number;
  followersCount: number;
}

export default async function ProfileHeader({
  accountId,
  authUserId,
  targetObjectId,
  name,
  username,
  imageUrl,
  bio,
  followingCount,
  followersCount,
}: Props) {

  const followingStatus = accountId !== authUserId ? await isFollowing({ currentUserId: authUserId, targetUserObjectId: targetObjectId }) : false

  return(
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imageUrl}
              alt="Profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-neutral-500">
              @{username}
            </p>

            <span className="text-light-2 text-subtle-medium">{followingCount} Following</span>
            <span className="text-light-2 text-subtle-medium p-3">{followersCount} Follower{followersCount !== 1 && "s"}</span>
          </div>
        </div>

        {accountId === authUserId ?
          <Link href='/profile/edit'>
            <div className='flex bg-dark-2 border-gray-500 hover:bg-zinc-900 border min-w-[74px] cursor-pointer gap-2 rounded-md px-4 py-2'>
              <p className='text-light-1 text-small-regular mt-0.5 pl-1'>Edit</p>
              <Image
                src='/assets/edit.svg'
                alt='logout'
                width={18}
                height={18}
                className="mb-0.5"
              />
            </div>
          </Link>
          :
          <ClientButton
            type="follow"
            targetUserObjectId={JSON.stringify(targetObjectId)}
            currentUserId={authUserId}
            following={followingStatus}
          />
        }
        
      </div>
      <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

      <div className='mt-10 h-0.5 w-full bg-dark-3' />
    </div>
  )
}