import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { CardInnerWrapper } from '@/components/CardInnerWrapper'

import { MemberDetailedPageProps } from '../page'

const ChatPage = async ({ params: { userId } }: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(userId)
	const t = await getTranslations('member-detailed')

	if (!member) return notFound()

	return (
		<CardInnerWrapper header={t('chat', { name: member.name })} body='msagge' />
	)
}

export default ChatPage
