import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from '@nextui-org/react'
import { BsFillBalloonHeartFill } from 'react-icons/bs'
import TopNavLink from '@/components/navbar/TopNavLink'

const navItems = [
	{
		href: '/members',
		label: 'Matches',
	},
	{
		href: '/lists',
		label: 'Lists',
	},
	{
		href: '/messages',
		label: 'Messages',
	},
]

const navItemsButton = [
	{
		href: '/login',
		label: 'Login',
	},
	{
		href: '/register',
		label: 'Register',
	},
]

const TopNav = () => {
	return (
		<Navbar
			maxWidth='2xl'
			className='main-gradient'
			classNames={{
				item: [
					'text-l',
					'text-white',
					'uppercase',
					'font-light',
					'h-full',
					'data-[active=true]:top-nav-link--active',
				],
			}}
		>
			<NavbarBrand as={Link} href='/'>
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
				{navItemsButton.map((item) => (
					<Button
						as={Link}
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
