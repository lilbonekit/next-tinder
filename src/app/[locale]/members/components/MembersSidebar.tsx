import { Card, CardBody, CardFooter, Divider, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { CgProfile } from 'react-icons/cg'
import { FiMessageCircle } from 'react-icons/fi'
import { TbPhotoCircle } from 'react-icons/tb'

import { calculateAge } from '@/lib/util'

import { MembersSidebarBack } from './MembersSidebarBack'
import { MembersSidebarLink } from './MembersSidebarLink'

interface MembersSidebarProps {
	member: Member
}

export const MembersSidebar = ({ member }: MembersSidebarProps) => {
	const t = useTranslations('members-sidebar')
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
		<Card className='w-full mt-10 items-center h-[80vh]'>
			<div className='rounded-full mt-6 overflow-hidden'>
				<Image
					isBlurred
					height={200}
					width={200}
					src={member.image || '/images/user.png'}
					alt={t('profile-alt')}
					className='rounded-full aspect-square object-cover'
				/>
			</div>
			<CardBody>
				<div className='flex flex-col items-center gap-1'>
					<div className='text-2xl text-center font-light'>
						{member.name}, {calculateAge(member.dateOfBirth)}
					</div>
					<div className='text-sm text-neutral-500 text-center'>
						{member.city}, {member.country}
					</div>
				</div>
				<Divider className='my-3' />
				<nav className='flex flex-col text-xl'>
					{navLinks.map((link) => (
						<MembersSidebarLink {...link} key={link.name} />
					))}
				</nav>
			</CardBody>
			<CardFooter>
				<MembersSidebarBack />
			</CardFooter>
		</Card>
	)
}
