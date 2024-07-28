import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { PiSpinnerGap } from 'react-icons/pi'

interface StarButtonProps {
	selected: boolean
	loading: boolean
}

export const StarButton = ({ selected, loading }: StarButtonProps) => {
	return (
		<div className='relative hover:opacity-80 transition cursor-pointer'>
			{!loading ? (
				<>
					<AiOutlineStar
						size={25}
						className={`fill-white absolute -top-[2px] -right-[2px]`}
					/>
					<AiFillStar
						size={22}
						className={selected ? 'fill-yellow-500' : 'fill-neutral-500/90'}
					/>
				</>
			) : (
				<PiSpinnerGap size={22} className='fill-white animate-spin' />
			)}
		</div>
	)
}
