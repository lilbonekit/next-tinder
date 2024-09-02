'use client'

import {
	CalendarDate,
	CalendarDateTime,
	ZonedDateTime,
} from '@internationalized/date'
import {
	DatePicker,
	Input,
	Select,
	SelectItem,
	Textarea,
} from '@nextui-org/react'
import { I18nProvider } from '@react-aria/i18n'
import { useLocale, useTranslations } from 'next-intl'
import { FieldError, useFormContext } from 'react-hook-form'
import { GENDERS } from 'types/enums'

import { getErrorMessage } from '@/lib/util'

export const ProfileForm = () => {
	const {
		register,
		formState: { errors },
		getValues,
		setValue,
	} = useFormContext()
	const t = useTranslations('register-form')
	const locale = useLocale()
	const genderList = [
		{
			label: t('male'),
			value: GENDERS.male,
		},
		{
			label: t('female'),
			value: GENDERS.female,
		},
	]

	const handleDateSelect = (
		e: CalendarDate | CalendarDateTime | ZonedDateTime
	) => {
		const { year, month, day } = e
		const date = new CalendarDate(year, month, day).toString()
		setValue('dateOfBirth', date)
	}

	const localeProp = locale === 'ua' ? 'uk-UA' : 'en-EN'

	return (
		<div className='space-y-2'>
			<Select
				{...register('gender')}
				size='md'
				aria-label={t('select-gender')}
				defaultSelectedKeys={getValues('gender')}
				label={t('gender-lbl')}
				variant='bordered'
				isInvalid={!!errors.gender}
				autoComplete='gender'
				errorMessage={t(getErrorMessage(errors.gender as FieldError))}
				onChange={(e) => setValue('gender', e.target.value as GENDERS)}
			>
				{genderList.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</Select>
			<I18nProvider locale={localeProp}>
				<DatePicker
					{...register('dateOfBirth')}
					size='md'
					showMonthAndYearPickers
					granularity='day'
					defaultValue={getValues('dateOfBirth')}
					label={t('date-of-birth-lbl')}
					variant='bordered'
					isInvalid={!!errors.dateOfBirth}
					onChange={handleDateSelect}
					errorMessage={t(getErrorMessage(errors.dateOfBirth as FieldError))}
				/>
			</I18nProvider>
			<Textarea
				{...register('description')}
				size='md'
				defaultValue={getValues('description')}
				label={t('description-lbl')}
				variant='bordered'
				isInvalid={!!errors.description}
				autoComplete='description'
				errorMessage={t(getErrorMessage(errors.description as FieldError))}
			/>
			<Input
				{...register('country')}
				size='md'
				defaultValue={getValues('country')}
				label={t('country-lbl')}
				variant='bordered'
				isInvalid={!!errors.country}
				autoComplete='country'
				errorMessage={t(getErrorMessage(errors.country as FieldError))}
			/>
			<Input
				{...register('city')}
				size='md'
				defaultValue={getValues('city')}
				label={t('city-lbl')}
				variant='bordered'
				isInvalid={!!errors.city}
				autoComplete='city'
				errorMessage={t(getErrorMessage(errors.city as FieldError))}
			/>
		</div>
	)
}
