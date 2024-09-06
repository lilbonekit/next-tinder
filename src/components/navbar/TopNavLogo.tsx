import { Link } from 'navigation'
import { useTranslations } from 'next-intl'
import { BsFillBalloonHeartFill } from 'react-icons/bs'

const TopNavLogo = () => {
	const t = useTranslations('logo')

	return (
		<>
			<Link href='/members' className='flex transition-all hover:opacity-90'>
				<BsFillBalloonHeartFill size={40} className='text-pink-950' />
				<div className='font-bold text-3xl flex text-pink-950'>
					<span className='text-pink-950 font-light'>{t('next')}</span>
					<span className='text-3xl text-light-gradient font-light'>
						{t('tinder')}
					</span>
				</div>
			</Link>
		</>
	)
}
export default TopNavLogo
