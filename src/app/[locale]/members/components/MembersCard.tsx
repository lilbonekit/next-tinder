import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'

import { calculateAge } from '@/lib/util'

export interface MembersCardProps {
	member: Member
}

export const MembersCard = ({ member }: MembersCardProps) => {
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
