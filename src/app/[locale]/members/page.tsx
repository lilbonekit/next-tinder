import { getMembers } from 'app/actions/membersActions'

import { MembersCardClient } from './components/MembersCardClient'

const Members = async () => {
	const members = await getMembers()
	return (
		<div className='mt-10'>
			<ul className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
				{members &&
					members.map((member) => (
						<MembersCardClient key={member.id} member={member} />
					))}
			</ul>
		</div>
	)
}
export default Members
