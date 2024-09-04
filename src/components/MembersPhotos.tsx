'use client'

import { ScrollShadow } from '@nextui-org/react'
import { Photo } from '@prisma/client'
import { deleteImage, setMainImage } from 'app/actions/userActions'
import { useRouter } from 'navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { DeleteButton } from '@/components/DeleteButton'
import { MemberImage } from '@/components/MemberImage'
import { StarButton } from '@/components/StarButton'

enum LOADING_TYPES {
	main = 'main',
	delete = 'delete',
}

interface MembersPhotosProps {
	photos: Photo[] | null
	alt: string
	noPhotoMsg: string
	editing?: boolean
	mainImageUrl?: string | null
}

export const MembersPhotos = ({
	photos,
	alt,
	noPhotoMsg,
	editing,
	mainImageUrl,
}: MembersPhotosProps) => {
	const router = useRouter()
	const t = useTranslations('image-upload-button')
	const [loading, setIsLoading] = useState({
		type: '',
		isLoading: false,
		id: '',
	})

	const onSetMain = async (photo: Photo) => {
		if (photo.url === mainImageUrl) return
		setIsLoading({ isLoading: true, id: photo.id, type: LOADING_TYPES.main })
		try {
			await setMainImage(photo)
			router.refresh()
		} catch (error) {
			toast.error(t('problem-adding-image'))
		} finally {
			setIsLoading({ isLoading: false, type: '', id: '' })
		}
	}

	const onDelete = async (photo: Photo) => {
		if (photo.url === mainImageUrl) return
		setIsLoading({ isLoading: true, id: photo.id, type: LOADING_TYPES.delete })
		await deleteImage(photo)
		router.refresh()
		setIsLoading({ isLoading: false, type: '', id: '' })
	}

	return (
		<>
			{photos && photos.length ? (
				<ScrollShadow
					hideScrollBar
					size={25}
					className='mt-5 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4'
				>
					{photos.map((photo) => (
						<div key={photo.id} className='relative'>
							<MemberImage alt={alt} photo={photo} key={photo.id} />
							{editing && (
								<>
									<div
										onClick={() => onSetMain(photo)}
										className='absolute top-3 left-2 z-50'
									>
										<StarButton
											loading={
												loading.isLoading &&
												loading.type === LOADING_TYPES.main &&
												loading.id === photo.id
											}
											selected={photo.url === mainImageUrl}
										/>
									</div>
									<div
										onClick={() => onDelete(photo)}
										className='absolute top-3 right-2 z-50'
									>
										<DeleteButton
											loading={
												loading.isLoading &&
												loading.type === LOADING_TYPES.delete &&
												loading.id === photo.id
											}
										/>
									</div>
								</>
							)}
						</div>
					))}
				</ScrollShadow>
			) : (
				<div className='flex justify-center items-center w-full h-full'>
					<span className='text-neutral-500 font-light text-center'>
						{noPhotoMsg}
					</span>
				</div>
			)}
		</>
	)
}
