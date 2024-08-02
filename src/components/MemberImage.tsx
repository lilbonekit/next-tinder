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
		<>
			{photo?.publicId ? (
				<CldImage
					alt={alt}
					src={photo.publicId}
					width={300}
					height={300}
					crop='fill'
					gravity='faces'
					className='rounded-2xl aspect-square object-cover'
					priority
				/>
			) : (
				<Image
					width={300}
					src={photo?.url || '/images/user.png'}
					alt={alt}
					className='object-cover aspect-square'
				/>
			)}
		</>
	)
}
