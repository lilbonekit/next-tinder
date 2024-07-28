'use client'

import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { useLocale, useTranslations } from 'next-intl'
import { TbPhotoCircle } from 'react-icons/tb'

interface ImageUploadButtonProps {
	onUploadImage: (result: CloudinaryUploadWidgetResults) => void
}

export const ImageUploadButton = ({
	onUploadImage,
}: ImageUploadButtonProps) => {
	const t = useTranslations('image-upload-button')
	const locale = useLocale()

	return (
		<CldUploadButton
			options={{ maxFiles: 1 }}
			onSuccess={onUploadImage}
			signatureEndpoint={`/${locale}/api/sign-image`}
			uploadPreset='nm-demo'
			className='flex items-center gap-2 rounded-lg py-2 px-4 hover:main-gradient/70 border-pink-500 border-dashed border-1 text-pink-500'
		>
			<TbPhotoCircle size={20} />
			<span className='text-sm'>{t('text')}</span>
		</CldUploadButton>
	)
}
