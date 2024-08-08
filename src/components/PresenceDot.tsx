'use client'

import { Member } from '@prisma/client'
import usePresenceStore from 'hooks/usePresenceStore'
import { useTranslations } from 'next-intl'
import { GoDotFill } from 'react-icons/go'

interface PresenceDotMember {
	member: Member
	text?: boolean
	size?: number
}

export const PresenceDot = ({ member, text, size = 18 }: PresenceDotMember) => {
	const { members } = usePresenceStore((state) => ({ members: state.members }))
	const t = useTranslations('presence-dot')
	const isOnline = members.includes(member.userId)

	if (!isOnline) return null

	return (
		<div className='flex items-center'>
			{text && <span className='text-neutral-500 text-sm'>{t(text)}</span>}
			<GoDotFill size={size} className='fill-green-500 animate-pulse' />
		</div>
	)
}
