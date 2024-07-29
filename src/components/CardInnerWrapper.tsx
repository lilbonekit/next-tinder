import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import { ReactNode } from 'react'

interface CardInnerWrapperProps {
	header: ReactNode | string
	body: ReactNode
	footer?: ReactNode
}

export const CardInnerWrapper = ({
	header,
	body,
	footer,
}: CardInnerWrapperProps) => {
	return (
		<>
			<CardHeader className='text-xl lg:text-2xl font-light text-pink-500 justify-center'>
				{header}
			</CardHeader>
			<Divider />
			<CardBody>{body}</CardBody>
			{footer && footer}
		</>
	)
}
