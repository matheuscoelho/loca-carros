'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

const resetPasswordSchema = z.object({
	password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não coincidem',
	path: ['confirmPassword'],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPassword() {
	const t = useTranslations('auth')
	const params = useParams()
	const router = useRouter()
	const token = params.token as string

	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema)
	})

	const onSubmit = async (data: ResetPasswordInput) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token,
					password: data.password,
				}),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Erro ao redefinir senha')
			}

			setSuccess(true)
			setTimeout(() => {
				router.push('/login')
			}, 3000)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao redefinir senha')
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
										Nova Senha
									</p>
									<h4 className="neutral-1000 mt-3">Redefinir Senha</h4>
									<p className="text-muted mt-2">
										Digite sua nova senha
									</p>
								</div>

								{success ? (
									<div className="mt-30 text-center">
										<div className="alert alert-success">
											<svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 text-success">
												<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
											<h5>Senha redefinida com sucesso!</h5>
											<p className="mb-0 mt-2">
												Você será redirecionado para o login em instantes...
											</p>
										</div>
										<Link href="/login" className="btn btn-primary mt-3">
											Ir para Login
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
													className={`form-control password ${errors.password ? 'is-invalid' : ''}`}
													type="password"
													placeholder="Nova senha"
													{...register('password')}
												/>
												{errors.password && (
													<div className="invalid-feedback">{errors.password.message}</div>
												)}
											</div>

											<div className="form-group">
												<input
													className={`form-control password ${errors.confirmPassword ? 'is-invalid' : ''}`}
													type="password"
													placeholder="Confirmar nova senha"
													{...register('confirmPassword')}
												/>
												{errors.confirmPassword && (
													<div className="invalid-feedback">{errors.confirmPassword.message}</div>
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
															Redefinindo...
														</>
													) : (
														<>
															Redefinir Senha
															<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														</>
													)}
												</button>
											</div>

											<p className="text-sm-medium neutral-500 text-center">
												<Link className="neutral-1000" href="/login">Voltar para Login</Link>
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
