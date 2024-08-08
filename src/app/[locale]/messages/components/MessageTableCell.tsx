import { Button } from '@nextui-org/react'
import { AiFillDelete } from 'react-icons/ai'
import { MessageDto } from 'types'
import { MESSAGE_TABLE_KEYS } from 'types/enums'

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
	const cellValue = item[columnKey]
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
			return cellValue
		default:
			return (
				<Button
					color='danger'
					variant='light'
					startContent={<AiFillDelete className='danger' size={20} />}
					onClick={() => handleDeleteMessage(item)}
					isLoading={isDeleting.id === item.id && isDeleting.loading}
				>
					{buttonText}
				</Button>
			)
	}
}
