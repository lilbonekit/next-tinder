import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { MemberDetailedPageProps } from '../page'

const ChatPage = async ({ params: { userId } }: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(userId)
	const t = await getTranslations('member-detailed')

	if (!member) return notFound()

	return (
		<>
			<CardHeader className='text-2xl font-light text-pink-500 justify-center'>
				{t('chat', { name: member.name })}
			</CardHeader>
			<Divider />
			<CardBody>Messages</CardBody>
		</>
	)
}

export default ChatPage
