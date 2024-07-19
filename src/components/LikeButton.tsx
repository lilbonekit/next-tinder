'use client'

import { toggleLikeMember } from 'app/actions/likeActions'
import { useRouter } from 'navigation'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

interface LikeButtonProps {
	targetId: string
	hasLiked: boolean
}

export const LikeButton = ({ targetId, hasLiked }: LikeButtonProps) => {
	const router = useRouter()

	async function toggleLike() {
		await toggleLikeMember(targetId, hasLiked)
		router.refresh()
	}

	return (
		<div
			onClick={toggleLike}
			className='relative hover:opacity-80 transition cursor-pointer'
		>
			<AiOutlineHeart
				size={28}
				className='fill-white absolute -top-[2px] -right-[2px]'
			/>
			<AiFillHeart
				size={24}
				className={hasLiked ? 'fill-rose-500' : 'fill-neutral-500'}
			/>
		</div>
	)
}
