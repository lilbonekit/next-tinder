'use client'

import { NavbarItem } from '@nextui-org/react'
import { Link, usePathname } from 'navigation'

interface TopNavLinkProps {
	label: string
	href: string
}

const TopNavLink = ({ label, href }: TopNavLinkProps) => {
	const pathname = usePathname()

	return (
		<>
			<NavbarItem
				className='text-l text-white uppercase font-light data-[active=true]:top-nav-link--active relative flex items-center h-full'
				as={Link}
				key={label}
				isActive={pathname === `${href}`}
				href={href}
			>
				{label}
			</NavbarItem>
		</>
	)
}
export default TopNavLink
