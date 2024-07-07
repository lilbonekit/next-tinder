import { Button } from '@nextui-org/react'
import { FaRegSadCry } from 'react-icons/fa'

export default function Home() {
	return (
		<>
			JSON
			<Button
				href='/members'
				color='primary'
				variant='bordered'
				startContent={<FaRegSadCry size={20} />}
			></Button>
		</>
	)
}
