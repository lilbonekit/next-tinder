'use client'

import { Avatar } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { getMemberPhotoByPublicId } from 'app/actions/membersActions'
import { addImage, setMainImage } from 'app/actions/userActions'
import { useRouter } from 'navigation'
import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { useTranslations } from 'next-intl'
import { IoCameraOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'

import { transformImageUrl } from '@/lib/util'

interface UploadAvatarButtonProps {
	member: Member
}

export const UploadAvatarButton = ({ member }: UploadAvatarButtonProps) => {
	const router = useRouter()
	const t = useTranslations('image-upload-button')

	const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
		try {
			if (result.info && typeof result.info === 'object') {
				await addImage(result.info.secure_url, result.info.public_id)
				const uploadedPhoto = await getMemberPhotoByPublicId(
					result.info.public_id
				)
				await setMainImage(uploadedPhoto, true)
				router.refresh()
			}
		} catch (error) {
			toast.error(t('problem-adding-image'))
		}
	}

	return (
		<CldUploadButton
			options={{ maxFiles: 1 }}
			onSuccess={onAddImage}
			signatureEndpoint='/api/sign-image'
			uploadPreset='nm-demo'
			className='relative h-[144px]'
		>
			<Avatar
				className='w-36 h-36 lg:mb-5'
				src={transformImageUrl(member.image) || '/images/user.png'}
			/>
			<IoCameraOutline
				size={40}
				className='absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-white/80'
			/>
		</CldUploadButton>
	)
}
