import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'

import { LikeButton } from '@/components/LikeButton'
import { PresenceDot } from '@/components/PresenceDot'
import { calculateAge, transformImageUrl } from '@/lib/util'

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
		<Card isPressable>
			<Image
				isBlurred
				isZoomed
				alt={member.name}
				width={300}
				src={transformImageUrl(member.image) || '/images/user.png'}
				className='aspect-square object-cover'
			/>
			<div onClick={preventLinkAction}>
				<div className='absolute top-3 right-3 z-50'>
					<LikeButton targetId={member.userId} hasLiked={hasLiked} />
				</div>
			</div>
			<CardFooter className='flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient'>
				<div className='flex flex-col text-white'>
					<div className='flex items-center'>
						<span className='font-semibold text-left'>
							{member.name}, {calculateAge(member.dateOfBirth)}
						</span>
						<PresenceDot member={member} />
					</div>
					<span className='text-sm text-left'>{member.city}</span>
				</div>
			</CardFooter>
		</Card>
	)
}
