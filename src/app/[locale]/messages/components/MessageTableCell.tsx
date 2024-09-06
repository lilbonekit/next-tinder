'use client'

import { Button, ButtonProps, useDisclosure } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { AiFillDelete } from 'react-icons/ai'
import { MessageDto } from 'types'
import { MESSAGE_TABLE_KEYS } from 'types/enums'

import { AppModal } from '@/components/AppModal'
import { PresenceAvatar } from '@/components/PresenceAvatar'
import { truncateString } from '@/lib/util'

interface MessageTableCellProps {
	item: MessageDto
	columnKey: keyof MessageDto
	isOutbox: boolean
	buttonText: string
	handleDeleteMessage: (message: MessageDto) => void
	isDeleting: { id: string; loading: boolean }
}

export const MessageTableCell = ({
	item,
	columnKey,
	isOutbox,
	buttonText,
	handleDeleteMessage,
	isDeleting,
}: MessageTableCellProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cellValue = item[columnKey]
	const t = useTranslations('delete-message-modal')

	const onConfirmDeleteMessage = () => {
		handleDeleteMessage(item)
	}

	const footerButtons: ButtonProps[] = [
		{
			color: 'default',
			onClick: onClose,
			children: t('cancel-lbl'),
			variant: 'bordered',
		},
		{
			color: 'default',
			onClick: onConfirmDeleteMessage,
			children: <span className='text-light-gradient'>{t('submit-lbl')}</span>,
			className: 'main-gradient',
		},
	]

	switch (columnKey) {
		case MESSAGE_TABLE_KEYS.recipientName:
		case MESSAGE_TABLE_KEYS.senderName:
			return (
				<div className='flex items-center gap-3 cursor-pointer'>
					<PresenceAvatar
						userName={item.senderName}
						userId={isOutbox ? item.senderId : item.recipientId}
						src={isOutbox ? item.recipientImage : item.senderImage}
					/>
					<span>{cellValue}</span>
				</div>
			)
		case 'text':
			return <div>{truncateString(cellValue)}</div>
		case 'created':
			return <div>{cellValue}</div>
		default:
			return (
				<>
					<Button
						color='danger'
						variant='light'
						startContent={<AiFillDelete className='danger' size={20} />}
						onClick={() => onOpen()}
						isLoading={isDeleting.id === item.id && isDeleting.loading}
					>
						{buttonText}
					</Button>
					<AppModal
						isOpen={isOpen}
						onClose={onClose}
						header={t('title')}
						body={<span className='text-neutral-500'>{t('body')}</span>}
						footerButtons={footerButtons}
					/>
				</>
			)
	}
}
