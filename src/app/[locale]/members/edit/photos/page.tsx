import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import { getAuthUserId } from 'app/actions/authActions'
import {
	getMemberByUserId,
	getMemberPhotosByUserId,
} from 'app/actions/membersActions'
import { getTranslations } from 'next-intl/server'

import { MembersPhotos } from '@/components/MembersPhotos'

import { ImageUploadButtonClient } from './components/ImageUploadButtonClient'

const PhotosPage = async () => {
	const userId = await getAuthUserId()
	const photos = await getMemberPhotosByUserId(userId)
	const member = await getMemberByUserId(userId)
	const t = await getTranslations('photos-page')

	return (
		<>
			<CardHeader className='text-xl lg:text-2xl font-light text-pink-500 justify-center'>
				{t('title')}
			</CardHeader>
			<Divider />
			<CardBody>
				<MembersPhotos
					editing
					alt={t('photos-alt')}
					photos={photos}
					noPhotoMsg={t('no-photos')}
					mainImageUrl={member?.image}
				/>
			</CardBody>
			<Divider />
			<div className='flex justify-center py-5'>
				<ImageUploadButtonClient />
			</div>
		</>
	)
}

export default PhotosPage
