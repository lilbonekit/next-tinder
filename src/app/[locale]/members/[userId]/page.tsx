import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

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

	return (
		<>
			<CardHeader className='text-xl lg:text-2xl font-light text-pink-500 justify-center'>
				{t('title')}
			</CardHeader>
			<Divider />
			<CardBody>{member.description}</CardBody>
		</>
	)
}

export default MemberDetailedPage
