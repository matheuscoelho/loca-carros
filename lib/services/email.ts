import { Resend } from 'resend'

// Lazy initialization para permitir build sem env vars
let _resend: Resend | null = null

function getResend(): Resend {
	if (!_resend) {
		const apiKey = process.env.RESEND_API_KEY
		if (!apiKey) {
			throw new Error('RESEND_API_KEY não definida nas variáveis de ambiente')
		}
		_resend = new Resend(apiKey)
	}
	return _resend
}

interface SendEmailOptions {
	to: string
	subject: string
	html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
	const resend = getResend()
	const fromEmail = process.env.EMAIL_FROM || 'noreply@carento.com'

	const { data, error } = await resend.emails.send({
		from: `Carento <${fromEmail}>`,
		to,
		subject,
		html,
	})

	if (error) {
		console.error('Error sending email:', error)
		throw new Error('Falha ao enviar email')
	}

	return data
}

export async function sendPasswordResetEmail(email: string, token: string) {
	const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3050'
	const resetUrl = `${baseUrl}/reset-password/${token}`

	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
				<div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
					<div style="text-align: center; margin-bottom: 30px;">
						<h1 style="color: #1a1a1a; font-size: 24px; margin: 0;">Carento</h1>
					</div>

					<h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px;">Recuperação de Senha</h2>

					<p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
						Você solicitou a recuperação de senha da sua conta. Clique no botão abaixo para criar uma nova senha:
					</p>

					<div style="text-align: center; margin: 30px 0;">
						<a href="${resetUrl}"
						   style="display: inline-block; background: #6ee7b7; color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
							Redefinir Senha
						</a>
					</div>

					<p style="color: #999; font-size: 14px; line-height: 1.6;">
						Se você não solicitou esta recuperação de senha, pode ignorar este email. O link expira em 1 hora.
					</p>

					<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

					<p style="color: #999; font-size: 12px; text-align: center;">
						Se o botão não funcionar, copie e cole este link no seu navegador:<br>
						<a href="${resetUrl}" style="color: #6ee7b7; word-break: break-all;">${resetUrl}</a>
					</p>
				</div>
			</div>
		</body>
		</html>
	`

	return sendEmail({
		to: email,
		subject: 'Recuperação de Senha - Carento',
		html,
	})
}
