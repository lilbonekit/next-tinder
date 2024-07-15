import { Card } from '@nextui-org/react'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

import { MembersSidebar } from '../components/MembersSidebar'

interface MembersLayoutProps {
	children: ReactNode
	params: { userId: string }
}

const MembersLayout = async ({ children, params }: MembersLayoutProps) => {
	const member = await getMemberByUserId(params.userId)

	if (!member) return notFound()

	return (
		<div className='grid grid-cols-12 gap-5 h-[80vh]'>
			<div className='col-span-3'>
				<MembersSidebar member={member} />
			</div>
			<div className='col-span-9'>
				<Card className='w-full mt-10 h-[80vh]'>{children}</Card>
			</div>
		</div>
	)
}

export default MembersLayout
