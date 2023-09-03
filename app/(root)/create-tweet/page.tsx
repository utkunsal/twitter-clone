import CreateTweet from "@/components/forms/CreateTweet"
import { getUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Page() {
  const user = await currentUser()
  if (!user) 
    return null

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) 
    redirect("/onboarding")
  
  return(
    <>
      <h1 className="head-text">Create Tweet</h1>
      <CreateTweet 
        userId={JSON.stringify(userInfo._id)}
      />
    </>
  )
}