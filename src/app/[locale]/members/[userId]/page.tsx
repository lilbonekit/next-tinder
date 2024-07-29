import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { CardInnerWrapper } from '@/components/CardInnerWrapper'

export interface MemberDetailedPageProps {
	params: {
		userId: string
	}
}

const MemberDetailedPage = async ({
	params: { userId },
}: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(userId)

	if (!member) return notFound()

	const t = await getTranslations('member-detailed')

	return <CardInnerWrapper header={t('title')} body={member.description} />
}

export default MemberDetailedPage
