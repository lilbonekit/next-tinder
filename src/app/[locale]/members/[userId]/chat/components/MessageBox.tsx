'use client'

import { Avatar } from '@nextui-org/react'
import clsx from 'clsx'
import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { MessageDto } from 'types'

import { timeAgo, transformImageUrl } from '@/lib/util'

interface MessageBoxProps {
	message: MessageDto
	currentUserId: string
}

export const MessageBox = ({ message, currentUserId }: MessageBoxProps) => {
	const isCurrentUserSender = message.senderId === currentUserId
	const messageEndRef = useRef<HTMLDivElement>(null)
	const locale = useLocale()

	useEffect(() => {
		if (messageEndRef.current)
			messageEndRef.current.scrollIntoView({
				behavior: 'smooth',
			})
	}, [messageEndRef])

	const renderAvatar = () => (
		<Avatar
			className='self-end'
			name={message.senderName}
			src={transformImageUrl(message.senderImage) || '/images/user.png'}
		/>
	)

	const messageContentClasses = clsx(
		'flex flex-col p-3 gap-2 lg:gap-0.5 relative max-w-[270px] lg:max-w-[500px]',
		{
			'rounded-r-xl rounded-tl-xl text-white bg-gray-100': !isCurrentUserSender,
			'rounded-l-xl rounded-tr-xl border-gray-200 bg-pink-100':
				isCurrentUserSender,
		}
	)

	const isMessageRead = message.dateRead // && message.recipientId !== currentUserId

	const messageTextClasses = clsx('text-sm text-gray-800 transition-all', {
		'pb-4 w-[90%]': isMessageRead,
	})

	const renderMessageHeader = () => (
		<div
			className={clsx('flex lg:items-center w-full flex-col lg:flex-row', {
				'justify-between': isCurrentUserSender,
			})}
		>
			<span className='text-sm font-semibold text-gray-900'>
				{message.senderName}
			</span>
			<span className='text-[0.7rem] lg:ml-3 text-gray-500'>
				{message.created}
			</span>
		</div>
	)

	const renderMessageFooter = () =>
		isMessageRead && (
			<span className='absolute bottom-1 right-3 text-[0.7rem] text-gray-400'>
				{message.dateRead && (
					<div className='flex gap-1 items-center'>
						<MdOutlineRemoveRedEye size={15} />
						{timeAgo(message.dateRead, locale === 'ua')}
					</div>
				)}
			</span>
		)

	const renderMessageContent = () => (
		<div className={messageContentClasses}>
			{renderMessageHeader()}
			<p className={messageTextClasses}>{message.text}</p>
			{renderMessageFooter()}
		</div>
	)

	return (
		<div className='grid grid-rows-1'>
			<div
				className={clsx('flex gap-2 mb-3', {
					'justify-end': isCurrentUserSender,
					'justify-start': !isCurrentUserSender,
				})}
			>
				{!isCurrentUserSender && renderAvatar()}
				{renderMessageContent()}
				{isCurrentUserSender && renderAvatar()}
			</div>
			<div ref={messageEndRef} />
		</div>
	)
}
