import { Divider, ScrollShadow } from '@nextui-org/react'
import { getMemberByUserId } from 'app/actions/membersActions'
import { getMessageThread } from 'app/actions/messageAction'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { CardInnerWrapper } from '@/components/CardInnerWrapper'

import { MemberDetailedPageProps } from '../page'
import { ChatForm } from './components/ChatForm'
import { MessageBox } from './components/MessageBox'

const ChatPage = async ({ params: { userId } }: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(userId)

	if (!member) return notFound()

	const t = await getTranslations('member-detailed')
	const messages = await getMessageThread(userId)

	const body = messages.length ? (
		<ScrollShadow size={25}>
			<div>
				{messages.map((message) => (
					<MessageBox
						key={message.id}
						message={message}
						currentUserId={userId}
					/>
				))}
			</div>
		</ScrollShadow>
	) : (
		<div className='flex justify-center items-center w-full h-full'>
			<span className='text-neutral-500 font-light text-center'>
				No messages
			</span>
		</div>
	)

	return (
		<CardInnerWrapper
			header={t('chat', { name: member.name })}
			body={body}
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
