import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'

import { LikeButton } from '@/components/LikeButton'
import { calculateAge } from '@/lib/util'

export interface MembersCardProps {
	member: Member
	likeIds: string[]
}

export const MembersCard = ({ member, likeIds }: MembersCardProps) => {
	const hasLiked = likeIds.includes(member.userId)

	const preventLinkAction = (event: React.MouseEvent) => {
		event.stopPropagation()
		event.preventDefault()
	}

	return (
		<Card isPressable fullWidth>
			<Image
				isBlurred
				isZoomed
				alt={member.name}
				width={300}
				src={member.image || '/images/user.png'}
				className='aspect-square object-cover'
			/>
			<div onClick={preventLinkAction}>
				<div className='absolute top-3 right-3 z-50'>
					<LikeButton targetId={member.userId} hasLiked={hasLiked} />
				</div>
			</div>
			<CardFooter className='flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient'>
				<div className='flex flex-col text-white'>
					<span className='font-semibold text-left'>
						{member.name}, {calculateAge(member.dateOfBirth)}
					</span>
					<span className='text-sm text-left'>{member.city}</span>
				</div>
			</CardFooter>
		</Card>
	)
}
