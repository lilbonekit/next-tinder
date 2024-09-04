import { redirect } from 'navigation'

import { auth, signOut } from '@/auth'
import ClientSession from '@/components/ClientSession'

export default async function Home() {
	const session = await auth()

	// TODO: Add it if need to redirect to "/members"
	// redirect('/login')

	return (
		<div className='flex flex-row justify-around mt-20 gap-6'>
			<div className='bg-green-50 p-10 rounded-xl shadow-md w-1/2 overflow-auto'>
				{session?.user && <pre>{JSON.stringify(session.user, null, 2)}</pre>}
			</div>
			<ClientSession />
		</div>
	)
}
