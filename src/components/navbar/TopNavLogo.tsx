import { Link as NextUILink } from '@nextui-org/react'
import { BsFillBalloonHeartFill } from 'react-icons/bs'

const TopNavLogo = () => {
	return (
		<>
			<NextUILink href='/'>
				<BsFillBalloonHeartFill size={40} className='text-pink-950' />
				<div className='font-bold text-3xl flex text-pink-950'>
					<span className='text-pink-950 font-light'>Next</span>
					<span className='text-3xl text-light-gradient font-light'>
						Tinder
					</span>
				</div>
			</NextUILink>
		</>
	)
}
export default TopNavLogo
