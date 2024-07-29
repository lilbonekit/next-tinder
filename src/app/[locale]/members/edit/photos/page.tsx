import { Divider } from '@nextui-org/react'
import { getAuthUserId } from 'app/actions/authActions'
import {
	getMemberByUserId,
	getMemberPhotosByUserId,
} from 'app/actions/membersActions'
import { getTranslations } from 'next-intl/server'

import { CardInnerWrapper } from '@/components/CardInnerWrapper'
import { MembersPhotos } from '@/components/MembersPhotos'

import { ImageUploadButtonClient } from './components/ImageUploadButtonClient'

const PhotosPage = async () => {
	const userId = await getAuthUserId()
	const photos = await getMemberPhotosByUserId(userId)
	const member = await getMemberByUserId(userId)
	const t = await getTranslations('photos-page')

	return (
		<CardInnerWrapper
			header={t('title')}
			body={
				<MembersPhotos
					editing
					alt={t('photos-alt')}
					photos={photos}
					noPhotoMsg={t('no-photos')}
					mainImageUrl={member?.image}
				/>
			}
			footer={
				<>
					<Divider />
					<div className='flex justify-center py-5'>
						<ImageUploadButtonClient />
					</div>
				</>
			}
		/>
	)
}

export default PhotosPage
