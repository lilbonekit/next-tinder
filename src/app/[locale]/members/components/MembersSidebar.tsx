import { Card, CardBody, CardFooter, Divider, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { useTranslations } from 'next-intl'

import { calculateAge, transformImageUrl } from '@/lib/util'

import { MembersSidebarBack } from './MembersSidebarBack'
import { MembersSidebarLink } from './MembersSidebarLink'

interface MembersSidebarProps {
	member: Member
	navLinks: {
		name: string
		href: string
		icon: JSX.Element
	}[]
}

export const MembersSidebar = ({ member, navLinks }: MembersSidebarProps) => {
	const t = useTranslations('members-sidebar')

	return (
		<Card className='w-full mt-10 items-center lg:h-[80vh]'>
			<div className='rounded-full mt-6 overflow-hidden'>
				<Image
					isBlurred
					height={170}
					width={170}
					sizes='(max-width: 1000px) 100px, 200px'
					src={transformImageUrl(member.image) || '/images/user.png'}
					alt={t('profile-alt')}
					className='rounded-full aspect-square object-cover'
				/>
			</div>
			<CardBody>
				<div className='flex flex-col items-center gap-1'>
					<div className='text-xl lg:text-2xl text-center font-light'>
						{member.name}, {calculateAge(member.dateOfBirth)}
					</div>
					<div className='text-xs lg:text-sm text-neutral-500 text-center'>
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
