import { getTranslations } from 'next-intl/server'

import { CardWrapper } from '@/components/CardWrapper'

import { Body } from './components/Body'

const RegisterSuccessPage = async () => {
	const t = await getTranslations('register-success')
	return (
		<CardWrapper
			title={t('title')}
			description={t('description')}
			body={<Body />}
		/>
	)
}
export default RegisterSuccessPage
