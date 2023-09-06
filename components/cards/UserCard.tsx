import Image from "next/image"
import Link from "next/link";

interface Props {
  id: string,
  name: string,
  username: string,
  imageUrl: string,
}


export function UserCard({ id, name, username, imageUrl }: Props){
  return(
    <article className='user-card'>
      <div className='user-card_avatar'>
        <div className='relative h-12 w-12'>
          <Link href={`/profile/${id}`}>
            <Image
              src={imageUrl}
              alt='user_logo'
              fill
              className='rounded-full object-cover'
            />
          </Link>
        </div>
        <div className='flex-1 text-ellipsis text-light-1'>
          <Link href={`/profile/${id}`}>
            <h4 className='text-base-semibold flex flex-col'>
              {name}
              <span className='text-small-medium opacity-50'>@{username}</span>
            </h4>            
          </Link>
        </div>
      </div>
      <Link href={`/profile/${id}`} className='bg-primary-500 min-w-[74px] cursor-pointer rounded-md px-5 py-2 text-light-1 text-small-regular'>
        View
      </Link>
    </article>
  )
}