import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { FaRegSadCry } from 'react-icons/fa'

export default function Home() {
	return (
		<>
			JSON
			<Button
				as={Link}
				href='/members'
				color='primary'
				variant='bordered'
				startContent={<FaRegSadCry size={20} />}
			></Button>
		</>
	)
}
