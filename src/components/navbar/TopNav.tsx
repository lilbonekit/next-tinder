import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import { getUserInfoForNav } from 'app/actions/userActions'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import TopNavLink from '@/components/navbar/TopNavLink'
import TopNavLinkAuth from '@/components/navbar/TopNavLinkAuth'
import TopNavLocale from '@/components/navbar/TopNavLocale'
import TopNavLogo from '@/components/navbar/TopNavLogo'

import { FiltersWrapper } from './FiltersWrapper'
import TopNavUser from './TopNavUser'

const TopNav = async () => {
	const t = await getTranslations('top-nav')
	const session = await auth()
	const userInfo = session?.user && (await getUserInfoForNav())
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
		<>
			<Navbar maxWidth='2xl' className='main-gradient' position='sticky'>
				<NavbarBrand>
					<TopNavLogo />
				</NavbarBrand>
				<NavbarContent justify='center'>
					{userInfo &&
						navItems.map(({ label, href }) => (
							<TopNavLink key={label} label={label} href={href} />
						))}
				</NavbarContent>
				<NavbarContent justify='end'>
					<TopNavLocale />
					{userInfo ? (
						<TopNavUser user={userInfo} />
					) : (
						navItemsButton.map(({ href, label }) => (
							<TopNavLinkAuth href={href} label={label} key={label} />
						))
					)}
				</NavbarContent>
			</Navbar>
			<FiltersWrapper />
		</>
	)
}
export default TopNav
