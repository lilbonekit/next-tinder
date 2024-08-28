import { Member } from '@prisma/client'

import { MembersCardClient } from './MembersCardClient'

interface MembersListProps {
	members: Member[]
	likeIds: string[]
	noUsersMessage: string
}

export const MembersList = ({
	members,
	likeIds,
	noUsersMessage,
}: MembersListProps) => {
	return (
		<>
			{members && members.length ? (
				<div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8'>
					{members.map((member) => (
						<MembersCardClient
							key={member.id}
							member={member}
							likeIds={likeIds}
						/>
					))}
				</div>
			) : (
				<div className='flex justify-center items-center w-full h-full min-h-[400px]'>
					<span className='text-neutral-500 font-light text-center'>
						{noUsersMessage}
					</span>
				</div>
			)}
		</>
	)
}
