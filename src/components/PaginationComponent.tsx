'use client'

import { Pagination } from '@nextui-org/react'
import clsx from 'clsx'
import usePaginationStore from 'hooks/usePaginationStore'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

interface PaginationComponentProps {
	totalCount: number
}

export const PaginationComponent = ({
	totalCount,
}: PaginationComponentProps) => {
	const t = useTranslations('pagination')
	const { setPage, setPageSize, setPagination, pagination } =
		usePaginationStore((state) => ({
			setPage: state.setPage,
			setPageSize: state.setPageSize,
			setPagination: state.setPagination,
			pagination: state.pagination,
		}))

	const { pageNumber, pageSize, totalPages } = pagination

	useEffect(() => {
		setPagination(totalCount)
	}, [setPagination, totalCount])

	const start = (pageNumber - 1) * pageSize + 1
	const end = Math.min(pageNumber * pageSize, totalCount)
	const resultText = t('result-text', {
		start,
		end,
		totalCount,
	})

	return (
		<div className='border-t-2 w-full mt-5'>
			<div className='flex flex-row justify-between items-center py-5'>
				<div className='text-sm font-light'>{resultText}</div>
				{totalPages > 1 && (
					<Pagination
						total={totalPages}
						color='danger'
						initialPage={1}
						variant='bordered'
						onChange={setPage}
						page={pageNumber}
					/>
				)}
				<div className='flex flex-row gap-1 items-center text-sm'>
					<span className='font-light'>Page size:</span>
					{[3, 6, 12].map((size) => (
						<div
							key={size}
							onClick={() => setPageSize(size)}
							className={clsx('page-size-box', {
								'bg-danger text-white hover:bg-danger-500 hover:text-white border-2 border-danger-500':
									pageSize === size,
							})}
						>
							{size}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
