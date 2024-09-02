import { Avatar } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { Link } from 'navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'
import { MessageDto } from 'types'
import { TOAST_TYPES } from 'types/enums'

import { transformImageUrl, truncateString } from '@/lib/util'

interface MessageToastProps {
	type: TOAST_TYPES.newMessage
	message: MessageDto
}

interface LikeToastProps {
	type: TOAST_TYPES.like
	member: Member
}

export const ActionToast = (props: MessageToastProps | LikeToastProps) => {
	const info =
		props.type === TOAST_TYPES.like
			? {
					href: `/members/${props.member.userId}/chat`,
					image: props.member.image,
					name: props.member.name,
			  }
			: {
					href: `/members/${props.message.senderId}/chat`,
					image: props.message.senderImage,
					name: props.message.senderName,
			  }

	const t = useTranslations('notifications')
	return (
		<Link href={info.href} className='flex items-center z-50'>
			<div className='mr-2'>
				<Avatar
					src={transformImageUrl(info.image) || '/images/user.png'}
					alt={info.name}
					size='lg'
				/>
			</div>
			<div className='flex flex-grow flex-col justify-center'>
				<div className='font-semibold text-[12px]'>
					{truncateString(
						t(
							props.type === TOAST_TYPES.newMessage
								? 'new-message'
								: 'new-like',
							{
								name: info.name,
							}
						),
						22
					)}
				</div>
				<div className='text-[12px]'>{t('click-to-view')}</div>
			</div>
		</Link>
	)
}

export const customToast = (props: MessageToastProps | LikeToastProps) => {
	toast(<ActionToast {...props} />)
}
