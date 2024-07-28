import { Card } from '@nextui-org/react'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ReactNode } from 'react'
import { CgProfile } from 'react-icons/cg'
import { FiMessageCircle } from 'react-icons/fi'
import { TbPhotoCircle } from 'react-icons/tb'

import { MembersSidebar } from '../components/MembersSidebar'

interface MembersLayoutProps {
	children: ReactNode
	params: { userId: string }
}

const MembersLayout = async ({ children, params }: MembersLayoutProps) => {
	const member = await getMemberByUserId(params.userId)

	if (!member) return notFound()

	const t = await getTranslations('members-sidebar')
	const basePath = `/members/${member.userId}`
	const navLinks = [
		{
			name: t('profile'),
			href: `${basePath}`,
			icon: <CgProfile size={22} />,
		},
		{
			name: t('photos'),
			href: `${basePath}/photos`,
			icon: <TbPhotoCircle size={22} />,
		},
		{
			name: t('chat'),
			href: `${basePath}/chat`,
			icon: <FiMessageCircle size={22} />,
		},
	]

	return (
		<div className='grid grid-cols-12 gap-5 h-[80vh]'>
			<div className='col-span-3'>
				<MembersSidebar member={member} navLinks={navLinks} />
			</div>
			<div className='col-span-9'>
				<Card className='w-full mt-10 h-[80vh]'>{children}</Card>
			</div>
		</div>
	)
}

export default MembersLayout
