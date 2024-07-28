'use client'

import { Image } from '@nextui-org/react'
import { Photo } from '@prisma/client'
import { CldImage } from 'next-cloudinary'

interface MemberImageProps {
	photo: Photo | null
	alt: string
}

export const MemberImage = ({ photo, alt }: MemberImageProps) => {
	return (
		<div>
			{photo?.publicId ? (
				<CldImage
					alt={alt}
					src={photo.publicId}
					width={150}
					height={150}
					crop='fill'
					gravity='faces'
					className='rounded-2xl'
					priority
				/>
			) : (
				<Image
					width={150}
					height={150}
					src={photo?.url || '/images/user.png'}
					alt={alt}
					className='object-cover aspect-square'
				/>
			)}
		</div>
	)
}
