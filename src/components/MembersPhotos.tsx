'use client'

import { ScrollShadow } from '@nextui-org/react'
import { Photo } from '@prisma/client'
import { deleteImage, setMainImage } from 'app/actions/userActions'
import { useRouter } from 'navigation'
import { useState } from 'react'

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
	const [loading, setIsLoading] = useState({
		type: '',
		isLoading: false,
		id: '',
	})

	const onSetMain = async (photo: Photo) => {
		if (photo.url === mainImageUrl) return
		setIsLoading({ isLoading: true, id: photo.id, type: LOADING_TYPES.main })
		await setMainImage(photo)
		router.refresh()
		setIsLoading({ isLoading: false, type: '', id: '' })
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
					size={40}
					className='flex gap-3 flex-wrap items-center h-max lg:p-2'
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
