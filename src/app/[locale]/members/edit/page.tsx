import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import { getAuthUserId } from 'app/actions/authActions'
import { getMemberByUserId } from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { EditForm } from './components/EditForm'
import { UploadAvatarButton } from './components/UploadAvatarButton'

const MemberEditPage = async () => {
	const userId = await getAuthUserId()
	const member = await getMemberByUserId(userId)

	if (!member) return notFound()

	const t = await getTranslations('member-edit')
	return (
		<>
			<CardHeader className='text-xl lg:text-2xl font-light text-pink-500 justify-center'>
				{t('title')}
			</CardHeader>
			<Divider />
			<CardBody className='flex flex-col space-y-2 m-auto items-center lg:justify-center'>
				<UploadAvatarButton member={member} />
				<EditForm member={member} />
			</CardBody>
		</>
	)
}

export default MemberEditPage
