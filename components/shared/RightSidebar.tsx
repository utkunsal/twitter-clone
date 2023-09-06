import { getRandomUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { UserCard } from "../cards/UserCard";

export default async function RightSidebar(){
	const user = await currentUser();
	const randomUsers = await getRandomUsers(user?.id ?? "")
	return(
		<section className="custom-scrollbar rightsidebar">
			<div className="flex flex-1 flex-col justify-start">
				<h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
				<div className='flex flex-col mt-8 gap-8'>
					{randomUsers.length === 0 ? 
						<p className='no-result'>No Users</p>
						:
						<>
							{randomUsers.map((person) => (
								<UserCard
									key={person.id}
									id={person.id}
									name={person.name}
									username={person.username}
									imageUrl={person.image}
								/>
							))}
						</>
					}
				</div>
			</div>
		</section>
	)
}