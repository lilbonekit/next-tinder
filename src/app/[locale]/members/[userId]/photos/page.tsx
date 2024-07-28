import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import {
	getMemberByUserId,
	getMemberPhotosByUserId,
} from 'app/actions/membersActions'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { MembersPhotos } from '@/components/MembersPhotos'

import { MemberDetailedPageProps } from '../page'

const GalleryPage = async ({ params: { userId } }: MemberDetailedPageProps) => {
	const member = await getMemberByUserId(userId)
	const photos = await getMemberPhotosByUserId(userId)

	if (!member) return notFound()

	const t = await getTranslations('member-detailed')

	return (
		<>
			<CardHeader className='text-2xl font-light text-pink-500 justify-center'>
				{t('photos', { name: member.name })}
			</CardHeader>
			<Divider />
			<CardBody>
				<MembersPhotos
					alt={'photos-alt'}
					photos={photos}
					noPhotoMsg={t('no-photos', { name: member.name })}
				/>
			</CardBody>
		</>
	)
}

export default GalleryPage
