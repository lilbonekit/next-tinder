'use client'

import { NavbarItem } from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import { Link } from 'navigation'
import { useLocale } from 'next-intl'

interface TopNavLinkProps {
	label: string
	href: string
}

const TopNavLink = ({ label, href }: TopNavLinkProps) => {
	const pathname = usePathname()
	const locale = useLocale()

	return (
		<>
			<NavbarItem
				className='text-l text-white uppercase font-light data-[active=true]:top-nav-link--active relative flex items-center h-full'
				as={Link}
				key={label}
				isActive={pathname === `/${locale}${href}`}
				href={href}
			>
				{label}
			</NavbarItem>
		</>
	)
}
export default TopNavLink
