'use client'

import { Link, NavbarItem } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

interface TopNavLinkProps {
	label: string
	href: string
}

const TopNavLink = ({ label, href }: TopNavLinkProps) => {
	const pathname = usePathname()
	return (
		<>
			<NavbarItem
				as={Link}
				href={href}
				key={label}
				isActive={pathname === href}
			>
				{label}
			</NavbarItem>
		</>
	)
}
export default TopNavLink
