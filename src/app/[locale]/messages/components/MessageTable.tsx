'use client'

import {
	Card,
	ScrollShadow,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react'
import { useMessages } from 'hooks/useMessages'
import { useTranslations } from 'next-intl'
import { Key } from 'readline'
import { MessageDto } from 'types'
import { MESSAGE_TABLE_KEYS } from 'types/enums'

import { MessageTableCell } from './MessageTableCell'

interface MessageTableProps {
	initialMessages: MessageDto[]
}

export const MessageTable = ({ initialMessages }: MessageTableProps) => {
	const t = useTranslations('message-table')
	const { columns, isDeleting, deleteMessage, selectRow, isOutbox, messages } =
		useMessages(initialMessages)

	return (
		<Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
			<ScrollShadow>
				<Table
					aria-label={t('table-with-messages')}
					selectionMode='single'
					shadow='none'
					onRowAction={(key) => {
						selectRow(key as Key)
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
										<MessageTableCell
											buttonText={t('delete-btn')}
											isDeleting={isDeleting}
											handleDeleteMessage={deleteMessage}
											columnKey={columnKey as keyof MessageDto}
											isOutbox={isOutbox}
											item={item}
											key={item.id}
										/>
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
