import { redirect } from 'navigation'

import { auth, signOut } from '@/auth'

export default async function Home() {
	const session = await auth()

	// TODO: Add it if need to redirect to "/members"
	// redirect('/login')

	return (
		<>
			{session?.user && <pre>{JSON.stringify(session.user, null, 2)}</pre>}
			<form
				action={async () => {
					'use server'
					await signOut()
				}}
			/>
		</>
	)
}
