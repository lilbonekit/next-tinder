export const dynamic = 'force-dynamic'
export const revalidate = 0

import { Divider } from '@nextui-org/react'
import { getAuthUserId } from 'app/actions/authActions'
import { getMemberByUserId } from 'app/actions/membersActions'
import { getMessageThread } from 'app/actions/messageAction'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { CardInnerWrapper } from '@/components/CardInnerWrapper'
import { createChatId } from '@/lib/util'

import { MemberDetailedPageProps } from '../page'
import { ChatForm } from './components/ChatForm'
import { MessageList } from './components/MessageList'

const ChatPage = async ({ params }: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(params.userId)

	if (!member) return notFound()

	const userId = await getAuthUserId()
	const t = await getTranslations('member-detailed')
	const messages = await getMessageThread(params.userId)
	const chatId = createChatId(userId, params.userId)

	return (
		<CardInnerWrapper
			header={t('chat', { name: member.name })}
			body={
				<MessageList
					initialMessages={messages}
					currentUserId={userId}
					chatId={chatId}
					noMessage={t('no-message')}
				/>
			}
			footer={
				<>
					<Divider />
					<div className='flex justify-center py-5 w-full lg:w-5/6 mx-auto px-3'>
						<ChatForm />
					</div>
				</>
			}
		/>
	)
}

export default ChatPage
