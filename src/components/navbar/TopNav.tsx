import {
	Button,
	Link as NextUILink,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from '@nextui-org/react'
import { BsFillBalloonHeartFill } from 'react-icons/bs'
import TopNavLink from '@/components/navbar/TopNavLink'
import TopNavLocale from '@/components/navbar//TopNavLocale'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

const TopNav = () => {
	const t = useTranslations('top-nav')
	const locale = useLocale()

	const navItems = [
		{
			href: `/members`,
			label: t('matches'),
		},
		{
			href: '/lists',
			label: t('lists'),
		},
		{
			href: '/messages',
			label: t('messages'),
		},
	]

	const navItemsButton = [
		{
			href: '/login',
			label: t('login'),
		},
		{
			href: '/register',
			label: t('register'),
		},
	]

	return (
		<Navbar maxWidth='2xl' className='main-gradient'>
			<NavbarBrand as={NextUILink} href='/'>
				<BsFillBalloonHeartFill size={40} className='text-pink-950' />
				<div className='font-bold text-3xl flex text-pink-950'>
					<span className='text-pink-950 font-light'>Next</span>
					<span className='text-3xl text-light-gradient font-light'>
						Tinder
					</span>
				</div>
			</NavbarBrand>
			<NavbarContent justify='center'>
				{navItems.map((item) => (
					<TopNavLink key={item.label} label={item.label} href={item.href} />
				))}
			</NavbarContent>
			<NavbarContent justify='end'>
				<TopNavLocale />
				{navItemsButton.map((item) => (
					<Button
						as={NextUILink}
						href={item.href}
						key={item.label}
						variant='bordered'
						className='text-white'
					>
						{item.label}
					</Button>
				))}
			</NavbarContent>
		</Navbar>
	)
}
export default TopNav
