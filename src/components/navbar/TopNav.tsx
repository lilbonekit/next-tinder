import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import { useTranslations } from 'next-intl'

import TopNavLink from '@/components/navbar/TopNavLink'
import TopNavLinkAuth from '@/components/navbar/TopNavLinkAuth'
import TopNavLocale from '@/components/navbar/TopNavLocale'
import TopNavLogo from '@/components/navbar/TopNavLogo'

const TopNav = () => {
	const t = useTranslations('top-nav')

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
			<NavbarBrand>
				<TopNavLogo />
			</NavbarBrand>
			<NavbarContent justify='center'>
				{navItems.map(({ label, href }) => (
					<TopNavLink key={label} label={label} href={href} />
				))}
			</NavbarContent>
			<NavbarContent justify='end'>
				<TopNavLocale />
				{navItemsButton.map(({ href, label }) => (
					<TopNavLinkAuth href={href} label={label} key={label} />
				))}
			</NavbarContent>
		</Navbar>
	)
}
export default TopNav
