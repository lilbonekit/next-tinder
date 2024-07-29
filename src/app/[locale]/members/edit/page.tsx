import { getAuthUserId } from 'app/actions/authActions'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { CardInnerWrapper } from '@/components/CardInnerWrapper'

import { EditForm } from './components/EditForm'
import { UploadAvatarButton } from './components/UploadAvatarButton'

const MemberEditPage = async () => {
	const userId = await getAuthUserId()
	const member = await getMemberByUserId(userId)

	if (!member) return notFound()

	const t = await getTranslations('member-edit')
	return (
		<>
			<CardInnerWrapper
				header={t('title')}
				body={
					<div className='flex flex-col space-y-2 items-center lg:justify-center'>
						<UploadAvatarButton member={member} />
						<EditForm member={member} />
					</div>
				}
			/>
		</>
	)
}

export default MemberEditPage
