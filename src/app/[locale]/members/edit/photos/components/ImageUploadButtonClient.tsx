'use client'

import { addImage } from 'app/actions/userActions'
import { useRouter } from 'navigation'
import { CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { ImageUploadButton } from '@/components/ImageUploadButton'

export const ImageUploadButtonClient = () => {
	const t = useTranslations('image-upload-button')
	const router = useRouter()

	const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
		if (result.info && typeof result.info === 'object') {
			await addImage(result.info.secure_url, result.info.public_id)
			router.refresh()
			return
		}
		toast.error(t('problem-adding-image'))
	}
	return <ImageUploadButton onUploadImage={onAddImage} />
}
