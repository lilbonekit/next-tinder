import { Card } from '@nextui-org/react'
import { getAuthUserId } from 'app/actions/authActions'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ReactNode } from 'react'
import { CgProfile } from 'react-icons/cg'
import { TbPhotoCircle } from 'react-icons/tb'

import { MembersSidebar } from '../components/MembersSidebar'

interface MemberLayoutProps {
	children: ReactNode
}

const MemberLayout = async ({ children }: MemberLayoutProps) => {
	const userId = await getAuthUserId()
	const member = await getMemberByUserId(userId)

	if (!member) return notFound()

	const t = await getTranslations('member')
	const basePath = `/members/edit`
	const navLinks = [
		{
			name: t('edit-profile'),
			href: `${basePath}`,
			icon: <CgProfile size={22} />,
		},
		{
			name: t('update-photos'),
			href: `${basePath}/photos`,
			icon: <TbPhotoCircle size={22} />,
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

export default MemberLayout
