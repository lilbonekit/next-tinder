'use client'

import { NavbarItem } from '@nextui-org/react'
import useMessageStore from 'hooks/useMessageStore'
import { Link, usePathname } from 'navigation'

interface TopNavLinkProps {
	label: string
	href: string
	unreadCount?: string
}

const TopNavLink = ({ label, href }: TopNavLinkProps) => {
	const pathname = usePathname()
	const { unreadCount } = useMessageStore((state) => ({
		unreadCount: state.unreadCount,
	}))

	return (
		<>
			<NavbarItem
				className='text-l text-white uppercase font-light data-[active=true]:top-nav-link--active relative flex items-center h-full'
				as={Link}
				key={label}
				isActive={pathname === `${href}`}
				href={href}
			>
				<span>{label}</span>
				{href === '/messages' && <span className='ml-1'>({unreadCount})</span>}
			</NavbarItem>
		</>
	)
}
export default TopNavLink
