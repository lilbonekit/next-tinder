'use client'

import { toggleLikeMember } from 'app/actions/likeActions'
import clsx from 'clsx'
import { useRouter } from 'navigation'
import { useTransition } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

interface LikeButtonProps {
	targetId: string
	hasLiked: boolean
}

export const LikeButton = ({ targetId, hasLiked }: LikeButtonProps) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	function toggleLike() {
		startTransition(async () => {
			await toggleLikeMember(targetId, hasLiked)
			router.refresh()
		})
	}

	return (
		<div
			onClick={toggleLike}
			className='relative hover:opacity-80 transition cursor-pointer'
		>
			<AiOutlineHeart
				size={28}
				className={clsx('fill-white absolute -top-[2px] -right-[2px]', {
					'opacity-50': isPending,
				})}
			/>
			<AiFillHeart
				size={24}
				className={clsx('', {
					'fill-rose-500': hasLiked,
					'fill-neutral-500': !hasLiked,
					'opacity-50': isPending,
				})}
			/>
		</div>
	)
}
