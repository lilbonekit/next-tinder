import { Button } from '@nextui-org/react'
// import { redirect } from 'navigation'
import { FaRegSadCry } from 'react-icons/fa'

import { auth, signOut } from '@/auth'

export default async function Home() {
	const session = await auth()

	// TODO: Add it if need to redirect to "/members"
	// redirect('/login')

	return (
		<>
			<h1 className='text-2xl font-light'>session</h1>
			{session?.user && <pre>{JSON.stringify(session.user, null, 2)}</pre>}
			<form
				action={async () => {
					'use server'
					await signOut()
				}}
			>
				<Button
					type='submit'
					color='primary'
					variant='bordered'
					startContent={<FaRegSadCry size={20} />}
				>
					Sign out
				</Button>
			</form>
		</>
	)
}
