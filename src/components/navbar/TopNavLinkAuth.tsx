'use client'

import { Link } from 'navigation'
import { Button } from '@nextui-org/react'

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
