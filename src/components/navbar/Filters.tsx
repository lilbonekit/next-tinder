'use client'

import { Button, Select, SelectItem, Slider, Spinner } from '@nextui-org/react'
import { useFilters } from 'hooks/useFilters'

export const Filters = () => {
	const {
		genderList,
		orderByList,
		filters,
		selectAge,
		selectGender,
		selectOrder,
		isPending,
		t,
	} = useFilters()

	return (
		<div className='shadow-md py-3'>
			<div className='flex flex-row justify-around items-center'>
				<div className='flex gap-2 items-center text-danger uppercase text-xl font-light'>
					<span>{t('result')}</span>
					{isPending ? <Spinner size='sm' color='danger' /> : '10'}
				</div>
				<div className='flex gap-2 items-center'>
					<div className='font-light'>Gender:</div>
					{genderList.map(({ icon: Icon, value }) => (
						<Button
							key={value}
							size='md'
							isIconOnly
							className={
								filters.gender.includes(value)
									? 'text-white'
									: 'text-danger-500'
							}
							variant={filters.gender.includes(value) ? 'solid' : 'ghost'}
							color={'danger'}
							onClick={() => selectGender(value)}
						>
							<Icon size={24} />
						</Button>
					))}
				</div>
				<div className='flex flex-row items-center gap-2 w-1/4'>
					<Slider
						color='danger'
						size='sm'
						label={t('age-range')}
						minValue={18}
						maxValue={100}
						classNames={{
							label: 'font-light',
							value: 'font-light',
						}}
						defaultValue={filters.ageRange}
						onChangeEnd={(value) => selectAge(value as number[])}
					/>
				</div>
				<div className='w-1/4'>
					<Select
						size='md'
						fullWidth
						label={t('order-by')}
						aria-label={t('order-by-selector')}
						variant='bordered'
						selectedKeys={new Set([filters.orderBy])}
						onSelectionChange={selectOrder}
					>
						{orderByList.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</Select>
				</div>
			</div>
		</div>
	)
}
