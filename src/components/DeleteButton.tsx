import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai'
import { PiSpinnerGap } from 'react-icons/pi'

interface DeleteButtonProps {
	loading: boolean
}

export const DeleteButton = ({ loading }: DeleteButtonProps) => {
	return (
		<div className='relative hover:opacity-50 transition cursor-pointer'>
			{!loading ? (
				<>
					<AiFillDelete
						size={19}
						className='fill-neutral-500/90 absolute -top-[1px] -right-[1px]'
					/>
					<AiOutlineDelete
						size={22}
						className='fill-white absolute -top-[2px] -right-[2px]'
					/>
				</>
			) : (
				<PiSpinnerGap size={22} className='fill-white animate-spin' />
			)}
		</div>
	)
}
