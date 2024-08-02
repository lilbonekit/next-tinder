'use client'

import {
	Avatar,
	Button,
	Card,
	ScrollShadow,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react'
import { deleteMessage } from 'app/actions/messageAction'
import { useRouter } from 'navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Key, useCallback, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { MessageDto } from 'types'
import { MESSAGE_SIDEBAR_KEYS, MESSAGE_TABLE_KEYS } from 'types/enums'

import { truncateString } from '@/lib/util'

interface MessageTableProps {
	messages: MessageDto[]
}

export const MessageTable = ({ messages }: MessageTableProps) => {
	const [isDeleting, setIsDeleting] = useState({ id: '', loading: false })
	const t = useTranslations('message-table')
	const router = useRouter()
	const searchParams = useSearchParams()
	const isOutbox = searchParams.get('container') === MESSAGE_SIDEBAR_KEYS.outbox

	const columns = [
		{
			key: isOutbox
				? MESSAGE_TABLE_KEYS.recipientName
				: MESSAGE_TABLE_KEYS.senderName,
			label: isOutbox ? t('recipient') : t('sender'),
		},
		{
			key: MESSAGE_TABLE_KEYS.text,
			label: t('message'),
		},
		{
			key: MESSAGE_TABLE_KEYS.created,
			label: isOutbox ? t('date-sent') : t('date-received'),
		},
		{
			key: MESSAGE_TABLE_KEYS.actions,
			label: t('actions'),
		},
	]

	const handleDeleteMessage = useCallback(
		async (message: MessageDto) => {
			setIsDeleting({ id: message.id, loading: true })
			await deleteMessage(message.id, isOutbox)
			router.refresh()
			setIsDeleting({ id: '', loading: false })
		},
		[isOutbox, router]
	)

	const handleRowSelect = (key: Key) => {
		const message = messages.find((message) => message.id === key)
		const url = isOutbox
			? `/members/${message?.recipientId}`
			: `/members/${message?.senderId}`

		router.push(url + '/chat')
	}

	const renderCell = useCallback(
		(item: MessageDto, columnKey: keyof MessageDto) => {
			const cellValue = item[columnKey]

			switch (columnKey) {
				case 'recipientName':
				case 'senderName':
					return (
						<div className='flex items-center gap-3 cursor-pointer'>
							<Avatar
								alt={t('user-avatar-alt')}
								src={
									(isOutbox ? item.recipientImage : item.senderImage) ||
									'/images/user.png'
								}
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
							{t('delete-btn')}
						</Button>
					)
			}
		},
		[isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage, t]
	)

	return (
		<Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
			<ScrollShadow>
				<Table
					aria-label={t('table-with-messages')}
					selectionMode='single'
					shadow='none'
					onRowAction={(key) => {
						handleRowSelect(key)
					}}
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn
								width={column.key === MESSAGE_TABLE_KEYS.text ? '50%' : null}
								key={column.key}
							>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody items={messages} emptyContent={t('no-messages')}>
						{(item) => (
							<TableRow key={item.id} className='cursor-pointer'>
								{(columnKey) => (
									<TableCell
										className={`${
											!item.dateRead && !isOutbox && 'font-semibold'
										}`}
									>
										{renderCell(item, columnKey as keyof MessageDto)}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ScrollShadow>
		</Card>
	)
}
