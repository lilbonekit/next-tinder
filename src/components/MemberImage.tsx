'use client'

import { Button, Image } from '@nextui-org/react'
import { Photo } from '@prisma/client'
import { approvePhoto, rejectPhoto } from 'app/actions/adminActions'
import { clsx } from 'clsx'
import { useRole } from 'hooks/useRole'
import { useRouter } from 'navigation'
import { CldImage } from 'next-cloudinary'
import { useTranslations } from 'next-intl'
import { ImCheckmark, ImCross } from 'react-icons/im'
import { toast } from 'react-toastify'

interface MemberImageProps {
	photo: Photo | null
	alt: string
}

export const MemberImage = ({ photo, alt }: MemberImageProps) => {
	const t = useTranslations('member')
	const role = useRole()
	const isAdmin = role === 'ADMIN'
	const router = useRouter()

	if (!photo) return null

	const approve = async (photoId: string) => {
		try {
			await approvePhoto(photoId)
			router.refresh()
		} catch (error) {
			toast.error('something-wrong')
		}
	}

	const reject = async (photo: Photo) => {
		try {
			await rejectPhoto(photo)
			router.refresh()
		} catch (error) {
			toast.error('something-wrong')
		}
	}

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
					className={clsx('rounded-2xl aspect-square object-cover', {
						'opacity-40': !photo.isApproved && !isAdmin,
					})}
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
			{!photo?.isApproved && !isAdmin && (
				<div className='absolute bottom-2 w-full bg-warning-100 p-1'>
					<div className='flex justify-center text-warning-700 text-sm'>
						{t('await-approval')}
					</div>
				</div>
			)}
			{isAdmin && (
				<div className='flex flex-row gap-2 mt-2'>
					<Button
						onClick={() => approve(photo.id)}
						color='success'
						fullWidth
						variant='bordered'
					>
						<ImCheckmark size={20} />
					</Button>
					<Button
						onClick={() => reject(photo)}
						color='danger'
						fullWidth
						variant='bordered'
					>
						<ImCross size={20} />
					</Button>
				</div>
			)}
		</>
	)
}
