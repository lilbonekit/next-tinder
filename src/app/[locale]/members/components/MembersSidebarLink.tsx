'use client'

import { Link, usePathname } from 'navigation'
import { JSX } from 'react'

interface MembersSidebarLinkProps {
	name: string
	href: string
	icon: JSX.Element
}

export const MembersSidebarLink = ({
	href,
	name,
	icon,
}: MembersSidebarLinkProps) => {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			key={name}
			className={`block font-light rounded-large py-3 px-5 hover:bg-default/40 hover:transition-colors ${
				pathname === href
					? 'text-pink-500 hover:bg-pink-100'
					: 'text-neutral-800'
			}`}
		>
			<div className='flex gap-4 items-center'>
				<span
					className={`${pathname === href ? 'fill-current' : 'text-gray-400'}`}
				>
					{icon}
				</span>
				<span>{name}</span>
			</div>
		</Link>
	)
}
