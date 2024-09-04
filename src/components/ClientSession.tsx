'use client'

import { useSession } from 'next-auth/react'

const ClientSession = () => {
	const session = useSession()
	return (
		<div className='bg-blue-50 p-10 rounded-xl shadow-md w-1/2 overflow-auto'>
			{session && <pre>{JSON.stringify(session, null, 2)}</pre>}
		</div>
	)
}
export default ClientSession
