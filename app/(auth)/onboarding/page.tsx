import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser()
  if(!user)
    return

  const userInfo = await getUser(user.id);
  if (userInfo?.onboarded) 
    redirect("/");

  const userData = {
    id: user?.id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    imageUrl: userInfo ? userInfo?.image : user.imageUrl,
  }
  
  return(
    <main className="mx-auto flex max-w-3xl flex-col justify-start py-20 px-10">
      <h1 className="head-text text-heading3-bold text-center">
        Complete your profile
      </h1>
      <section className="bg-dark-2 mt-9 p-10">
        <AccountProfile 
          user={userData}
        />
      </section>
    </main>
  )
}