import { Divider } from '@nextui-org/react'
import { getUnapprovedPhotos } from 'app/actions/adminActions'
import { getTranslations } from 'next-intl/server'

import { MembersPhotos } from '@/components/MembersPhotos'

const PhotoModerationPage = async () => {
	const t = await getTranslations('photo-moderation')
	const photos = await getUnapprovedPhotos()
	return (
		<div className='flex flex-col mt-10 gap-3 container'>
			<h1 className='text-3xl uppercase text-pink-500 text-center font-light'>
				{t('photos-awaiting-moderation')}
			</h1>
			<Divider />
			<MembersPhotos
				photos={photos}
				alt={t('alt')}
				noPhotoMsg={t('no-photo-msg')}
			/>
		</div>
	)
}
export default PhotoModerationPage
