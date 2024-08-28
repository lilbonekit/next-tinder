export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getMessagesByContainer } from 'app/actions/messageAction'
import { MESSAGE_SIDEBAR_KEYS } from 'types/enums'

import { MessageSidebar } from './components/MessageSidebar'
import { MessageTable } from './components/MessageTable'

const MessagesPage = async ({
	searchParams,
}: {
	searchParams: { container: MESSAGE_SIDEBAR_KEYS }
}) => {
	const { messages, nextCursor } = await getMessagesByContainer(
		searchParams.container
	)
	return (
		<div className='grid grid-cols-12 gap-5 h-[80vh] mt-10'>
			<div className='col-span-2'>
				<MessageSidebar />
			</div>
			<div className='col-span-10'>
				<MessageTable initialMessages={messages} nextCursor={nextCursor} />
			</div>
		</div>
	)
}
export default MessagesPage
