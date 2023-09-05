import { UserCard } from "@/components/cards/UserCard"
import Pagination from "@/components/shared/Pagination"
import Searchbar from "@/components/shared/Searchbar"
import { getUser, searchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"


export default async function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const user = await currentUser()
  if (!user) 
    return null

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) 
    redirect("/onboarding")

  const response = await searchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 5,
  })

  return(
    <section>
      <Searchbar routeType="search" />

      <div className='flex flex-col mt-8 gap-8'>
        {response.users.length === 0 ? 
          <p className='no-result'>No Result</p>
          :
          <>
            {response.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imageUrl={person.image}
                personType='User'
              />
            ))}
          </>
        }
      </div>

      <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        hasNext={response.hasNext}
      />

    </section>
  )
}