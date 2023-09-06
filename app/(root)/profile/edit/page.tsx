import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import AccountProfile from "@/components/forms/AccountProfile";


export default async function Page() {
  const user = await currentUser();

  if (!user) 
    return null;

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) 
    redirect("/onboarding");

  const userData = {
    id: user.id,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    username: userInfo ? userInfo?.username : user.username,
    bio: userInfo ? userInfo?.bio : "",
    imageUrl: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className='mt-3 text-heading3-bold text-light-2'>Edit your profile</h1>
      <section className='mt-5'>
        <AccountProfile user={userData}/>
      </section>
    </>
  );
}