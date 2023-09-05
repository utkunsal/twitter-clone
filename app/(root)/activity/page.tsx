import { getUser, getUserActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser()
  if (!user) 
    return null

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) 
    redirect("/onboarding")

  const activity = await getUserActivity(userInfo._id)
  
  return(
    <>
      <h1 className="head-text mb-5">
        Activity
      </h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length !== 0 ? 
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/tweet/${activity.parent}`}>
                <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt='user image'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-zinc-400'>@{activity.author.username}</span>{" "}
                    replied to your tweet
                  </p>
                </article>
              </Link>
            ))}
          </>
        :
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        }
      </section>
    </>
  )
}