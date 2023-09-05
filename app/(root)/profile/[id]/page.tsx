import ProfileHeader from "@/components/shared/ProfileHeader"
import { getUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { 
  Tabs,
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import TweetsTab from "@/components/shared/TweetsTab";
import RepliesTab from "@/components/shared/RepliesTab";
import LikesTab from "@/components/shared/LikesTab";


export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser()
  if (!user) 
    return null

  const userInfo = await getUser(params.id);

  if (!userInfo?.onboarded) 
    redirect("/onboarding")

  return(
    <section>
      <ProfileHeader 
        accountId={userInfo._id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imageUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-4">
        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <p>{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => {
            const componentMapping: Record<string, React.ComponentType<any>> = {
              "Tweets": TweetsTab,
              "Replies": RepliesTab,
              "Likes": LikesTab,
            };
            const DynamicComponent = componentMapping[tab.label];
            return(<TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              <DynamicComponent
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType='User'
              />
            </TabsContent>)
          })}
        </Tabs>
      </div>
    </section>
  )
}