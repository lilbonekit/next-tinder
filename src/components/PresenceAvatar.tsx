import { Avatar, Badge } from '@nextui-org/react'
import usePresenceStore from 'hooks/usePresenceStore'

import { transformImageUrl } from '@/lib/util'

interface PresenceAvatarProps {
	userId?: string
	userName?: string
	src?: string | null
}

export const PresenceAvatar = ({
	userId,
	src,
	userName,
}: PresenceAvatarProps) => {
	const { members } = usePresenceStore((state) => ({ members: state.members }))

	const isOnline = userId && members.includes(userId)
	return (
		<Badge color='success' shape='circle' isInvisible={!isOnline} content=''>
			<Avatar
				showFallback
				as='button'
				className='transition-transform light-gradient'
				classNames={{ name: 'font-semibold text-main-gradient' }}
				color='default'
				size='md'
				name={userName}
				{...(src ? { src: transformImageUrl(src) } : {})}
			/>
		</Badge>
	)
}
