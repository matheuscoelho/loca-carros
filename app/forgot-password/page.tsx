'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const forgotPasswordSchema = z.object({
	email: z.string().email('Email inválido'),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
	const t = useTranslations('auth')
	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordSchema)
	})

	const onSubmit = async (data: ForgotPasswordInput) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: data.email }),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Erro ao enviar email')
			}

			setSuccess(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao enviar email de recuperação')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<div className="row">
					<div className="col-lg-5 mx-auto">
						<div className="border rounded-3 px-md-5 px-3 ptb-50">
							<div className="login-content">
								<div className="text-center">
									<p className="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center">
										{t('forgotPassword')}
									</p>
									<h4 className="neutral-1000 mt-3">Recuperar Senha</h4>
									<p className="text-muted mt-2">
										Digite seu email para receber o link de recuperação
									</p>
								</div>

								{success ? (
									<div className="mt-30 text-center">
										<div className="alert alert-success">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-2">
												<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
											<p className="mb-0 mt-2">
												Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
											</p>
										</div>
										<Link href="/login" className="btn btn-outline-secondary mt-3">
											Voltar para Login
										</Link>
									</div>
								) : (
									<div className="form-login mt-30">
										<form onSubmit={handleSubmit(onSubmit)}>
											{error && (
												<div className="alert alert-danger mb-3" role="alert">
													{error}
												</div>
											)}

											<div className="form-group">
												<input
													className={`form-control username ${errors.email ? 'is-invalid' : ''}`}
													type="email"
													placeholder={t('email')}
													{...register('email')}
												/>
												{errors.email && (
													<div className="invalid-feedback">{errors.email.message}</div>
												)}
											</div>

											<div className="form-group mb-30">
												<button
													type="submit"
													className="btn btn-primary w-100"
													disabled={isLoading}
												>
													{isLoading ? (
														<>
															<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
															Enviando...
														</>
													) : (
														<>
															Enviar Link de Recuperação
															<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														</>
													)}
												</button>
											</div>

											<p className="text-sm-medium neutral-500 text-center">
												Lembrou a senha? <Link className="neutral-1000" href="/login">{t('signIn')}</Link>
											</p>
										</form>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
