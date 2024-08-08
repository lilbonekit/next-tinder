import { Avatar } from '@nextui-org/react'
import { Link } from 'navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'
import { MessageDto } from 'types'

import { transformImageUrl, truncateString } from '@/lib/util'

interface NewMessageToastProps {
	message: MessageDto
}

export const NewMessageToast = ({ message }: NewMessageToastProps) => {
	const t = useTranslations('notifications')
	return (
		<Link
			href={`/members/${message.senderId}/chat`}
			className='flex items-center z-50'
		>
			<div className='mr-2'>
				<Avatar
					src={transformImageUrl(message.senderImage) || '/images/user.png'}
					alt={message.senderName}
					size='lg'
				/>
			</div>
			<div className='flex flex-grow flex-col justify-center'>
				<div className='font-semibold text-[14px]'>
					{truncateString(
						t('new-message', {
							name: message.senderName,
						}),
						22
					)}
				</div>
				<div className='text-sm'>{t('click-to-view')}</div>
			</div>
		</Link>
	)
}

export const newMessageToasts = (message: MessageDto) => {
	toast(<NewMessageToast message={message} />)
}
