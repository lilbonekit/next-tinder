'use client'

import { Button } from '@nextui-org/react'
import { Link } from 'navigation'

interface TopNavLinkAuthProps {
	href: string
	label: string
}

const TopNavLinkAuth = ({ href, label }: TopNavLinkAuthProps) => {
	return (
		<>
			<Button
				as={Link}
				href={href}
				key={label}
				variant='bordered'
				className='text-white'
			>
				{label}
			</Button>
		</>
	)
}
export default TopNavLinkAuth
