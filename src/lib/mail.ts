import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
	email: string,
	token: string,
	locale: string
) {
	const link = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/verify-email?token=${token}`

	return resend.emails.send({
		from: 'testing@resend.dev',
		to: email,
		subject:
			locale === 'en'
				? 'Verify your email address'
				: 'Верифікуйте електронну адресу',
		html: `
      <h1>Verify your email address</h1>
      <p>Click the link below to verify your email address</p>
      <a href="${link}">Verify email</a>
    `,
	})
}

export async function sendPasswordResetEmail(
	email: string,
	token: string,
	locale: string
) {
	const link = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/reset-password?token=${token}`

	return resend.emails.send({
		from: 'testing@resend.dev',
		to: email,
		subject: locale === 'en' ? 'Reset your password' : 'Відновіть пароль',
		html: `
      <h1>You have request to reset your password</h1>
      <p>If it wasn't you please just ignore this message</p>
      <a href="${link}">Reset password</a>
    `,
	})
}
