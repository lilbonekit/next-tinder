'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { BsFillPatchExclamationFill } from 'react-icons/bs'
import { HiMiniCheckBadge } from 'react-icons/hi2'
import { ActionResult } from 'types'

interface ResultMessageProps {
	result: ActionResult<string> | null
}

export const ResultMessage = ({ result }: ResultMessageProps) => {
	const t = useTranslations('login-form')
	if (!result) return null

	return (
		<div
			className={clsx(
				'p-3 rounded-xl w-full flex items-center justify-center gap-x-2 text-sm',
				{
					'text-danger-800 bg-danger-50': result.status === 'error',
					'text-success-800 bg-success-50': result.status === 'success',
				}
			)}
		>
			{result.status === 'success' ? (
				<HiMiniCheckBadge className='text-success-500' size={20} />
			) : (
				<BsFillPatchExclamationFill className='text-danger-500' size={20} />
			)}
			<p>
				{result.status === 'success'
					? (t(result.data) as string)
					: (t(result.error) as string)}
			</p>
		</div>
	)
}
