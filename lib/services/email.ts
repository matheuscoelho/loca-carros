import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { randomUUID } from 'crypto'

// Lazy initialization do transporter
let _transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
	if (!_transporter) {
		const host = process.env.SMTP_HOST
		const port = parseInt(process.env.SMTP_PORT || '465')
		const user = process.env.SMTP_USER
		const pass = process.env.SMTP_PASS

		if (!host || !user || !pass) {
			throw new Error('Configurações SMTP não definidas nas variáveis de ambiente')
		}

		_transporter = nodemailer.createTransport({
			host,
			port,
			secure: port === 465,
			auth: {
				user,
				pass,
			},
			tls: {
				rejectUnauthorized: false
			},
			name: process.env.SMTP_HOSTNAME
		})
	}
	return _transporter
}

interface SendEmailOptions {
	to: string
	subject: string
	text: string
	html: string
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
	const transporter = getTransporter()
	const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER
	const fromName = process.env.SMTP_FROM_NAME || 'Navegar Sistemas'
	const domain = fromEmail?.split('@')[1] || 'navegarsistemas.com.br'

	const mailOptions: Mail.Options = {
		from: {
			name: fromName,
			address: fromEmail!
		},
		to,
		replyTo: fromEmail,
		subject,
		text,
		html,
		messageId: `<${randomUUID()}@${domain}>`,
		headers: {
			'X-Auto-Response-Suppress': 'OOF, AutoReply',
			'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>`,
		}
	}

	const info = await transporter.sendMail(mailOptions)
	console.log('Email sent:', info.messageId)
	return info
}

export async function sendPasswordResetEmail(email: string, token: string) {
	const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3050'
	const resetUrl = `${baseUrl}/reset-password/${token}`
	const companyName = 'Navegar Sistemas'
	const supportEmail = process.env.SMTP_FROM || 'no-reply@navegarsistemas.com.br'

	// Versão texto puro (obrigatório para evitar spam)
	const text = `
${companyName} - Recuperação de Senha

Olá,

Você solicitou a recuperação de senha da sua conta no ${companyName}.

Para redefinir sua senha, acesse o link abaixo:
${resetUrl}

Este link expira em 1 hora.

Se você não solicitou esta recuperação, ignore este email. Sua senha permanecerá a mesma.

Atenciosamente,
Equipe ${companyName}

---
Este é um email automático. Por favor, não responda.
Em caso de dúvidas, entre em contato: ${supportEmail}
	`.trim()

	// Versão HTML
	const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Recuperação de Senha - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<!-- Header -->
					<tr>
						<td align="center" style="padding: 40px 40px 20px 40px; border-bottom: 1px solid #eeeeee;">
							<h1 style="margin: 0; font-size: 28px; color: #333333; font-weight: bold;">${companyName}</h1>
						</td>
					</tr>
					<!-- Content -->
					<tr>
						<td style="padding: 40px;">
							<h2 style="margin: 0 0 20px 0; font-size: 22px; color: #333333;">Recuperação de Senha</h2>
							<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #555555;">
								Olá,
							</p>
							<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #555555;">
								Você solicitou a recuperação de senha da sua conta. Clique no botão abaixo para criar uma nova senha:
							</p>
							<!-- Button -->
							<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
								<tr>
									<td align="center" style="padding: 30px 0;">
										<a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #22c55e; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
											Redefinir Senha
										</a>
									</td>
								</tr>
							</table>
							<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #888888;">
								Este link expira em <strong>1 hora</strong>.
							</p>
							<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #888888;">
								Se você não solicitou esta recuperação de senha, pode ignorar este email com segurança. Sua senha permanecerá a mesma.
							</p>
							<!-- Link alternativo -->
							<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
								<tr>
									<td>
										<p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999;">
											Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
										</p>
										<p style="margin: 10px 0 0 0; font-size: 12px; line-height: 18px; color: #22c55e; word-break: break-all;">
											<a href="${resetUrl}" style="color: #22c55e;">${resetUrl}</a>
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<!-- Footer -->
					<tr>
						<td style="padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px;">
							<p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999; text-align: center;">
								Este é um email automático enviado por ${companyName}.<br>
								Por favor, não responda a este email.
							</p>
							<p style="margin: 15px 0 0 0; font-size: 12px; line-height: 18px; color: #999999; text-align: center;">
								&copy; ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim()

	return sendEmail({
		to: email,
		subject: `Recuperação de Senha - ${companyName}`,
		text,
		html,
	})
}
