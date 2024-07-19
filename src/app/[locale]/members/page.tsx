import { fetchCurrentUserLikeIds } from 'app/actions/likeActions'
import { getMembers } from 'app/actions/membersActions'

import { MembersCardClient } from './components/MembersCardClient'

const Members = async () => {
	const members = await getMembers()
	const likeIds = await fetchCurrentUserLikeIds()

	return (
		<div className='mt-10'>
			<ul className='mt-10 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8'>
				{members &&
					members.map((member) => (
						<MembersCardClient
							key={member.id}
							member={member}
							likeIds={likeIds}
						/>
					))}
			</ul>
		</div>
	)
}
export default Members
