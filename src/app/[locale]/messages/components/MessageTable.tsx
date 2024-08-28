'use client'

import {
	Button,
	Card,
	CardBody,
	CardFooter,
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
	nextCursor?: string
}

export const MessageTable = ({
	initialMessages,
	nextCursor,
}: MessageTableProps) => {
	const t = useTranslations('message-table')
	const {
		columns,
		isDeleting,
		deleteMessage,
		selectRow,
		isOutbox,
		messages,
		loadMore,
		loadingMore,
		hasMore,
	} = useMessages(initialMessages, nextCursor)

	return (
		<div className='flex flex-col h-[80vh]'>
			<Card className='flex flex-col overflow-auto'>
				<CardBody className='h-[70vh]'>
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
										width={
											column.key === MESSAGE_TABLE_KEYS.text ? '50%' : null
										}
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
				</CardBody>
				<CardFooter>
					<div className='mx-auto p-3'>
						<Button
							color='danger'
							variant='ghost'
							className='border-dashed border-1 text-pink-500 hover:main-gradient/70'
							isLoading={loadingMore}
							isDisabled={!hasMore}
							onClick={loadMore}
						>
							{hasMore ? t('load-more') : t('no-more-messages')}
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
