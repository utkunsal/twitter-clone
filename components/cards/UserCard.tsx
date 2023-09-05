"use client";

import Image from "next/image"
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  id: string,
  name: string,
  username: string,
  imageUrl: string,
  personType: string,
}


export function UserCard({ id, name, username, imageUrl, personType }: Props){
  const router = useRouter();

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

      <Button
        className='user-card_btn'
        onClick={() => {
          router.push(`/profile/${id}`);
        }}
      >
        View
      </Button>
    </article>
  )
}