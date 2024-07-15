'use client'

import { Link } from 'navigation'

import { MembersCard, MembersCardProps } from './MembersCard'

export const MembersCardClient = ({ member }: MembersCardProps) => {
	return (
		<Link href={`/members/${member.userId}`}>
			<MembersCard member={member} />
		</Link>
	)
}
