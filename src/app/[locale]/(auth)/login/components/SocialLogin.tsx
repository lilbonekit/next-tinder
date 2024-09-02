import { Button } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { AUTH_PROVIDERS } from 'types/enums'

export const SocialLogin = () => {
	const onClick = async (provider: AUTH_PROVIDERS) => {
		await signIn(provider, {
			callbackUrl: '/members',
		})
	}

	return (
		<div className='flex items-center w-full gap-2'>
			<Button
				size='lg'
				fullWidth
				variant='bordered'
				onClick={() => onClick(AUTH_PROVIDERS.google)}
			>
				<FcGoogle size={25} />
			</Button>
			<Button
				size='lg'
				fullWidth
				variant='bordered'
				onClick={() => onClick(AUTH_PROVIDERS.github)}
			>
				<FaGithub size={25} />
			</Button>
		</div>
	)
}
