'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginInput } from '@/lib/validations/auth'

export default function SuperAdminLogin() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema)
	})

	const onSubmit = async (data: LoginInput) => {
		setIsLoading(true)
		setError(null)

		try {
			const result = await signIn('credentials', {
				email: data.email,
				password: data.password,
				hostname: 'root-wl-login',
				redirect: false,
			})

			if (result?.error) {
				setError('Credenciais inválidas ou acesso não autorizado')
			} else {
				router.push('/root-wl')
				router.refresh()
			}
		} catch (err) {
			setError('Erro ao fazer login')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div
			className="d-flex align-items-center justify-content-center"
			style={{
				minHeight: '100vh',
				backgroundColor: '#1a1d21',
				padding: '20px'
			}}
		>
			<div className="w-100" style={{ maxWidth: '420px' }}>
				<div
					className="card border-0 shadow-lg"
					style={{
						backgroundColor: '#2d3138',
						borderRadius: '16px'
					}}
				>
					<div className="card-body p-4 p-md-5">
						{/* Header */}
						<div className="text-center mb-4">
							<div
								className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
								style={{
									width: '64px',
									height: '64px',
									backgroundColor: 'rgba(220, 53, 69, 0.1)'
								}}
							>
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<h3 className="text-white mb-1">Super Admin</h3>
							<p className="text-white-50 small mb-0">Acesso restrito ao painel administrativo</p>
						</div>

						{/* Security Notice */}
						<div
							className="alert mb-4 py-3"
							style={{
								backgroundColor: 'rgba(255, 193, 7, 0.1)',
								border: '1px solid rgba(255, 193, 7, 0.2)',
								borderRadius: '8px'
							}}
						>
							<div className="d-flex align-items-start gap-2">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" className="flex-shrink-0 mt-1">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
								<div>
									<p className="mb-0 small" style={{ color: '#ffc107' }}>
										<strong>Acesso Monitorado</strong>
									</p>
									<p className="mb-0 small" style={{ color: 'rgba(255, 193, 7, 0.7)' }}>
										Todas as atividades são registradas.
									</p>
								</div>
							</div>
						</div>

						{/* Login Form */}
						<form onSubmit={handleSubmit(onSubmit)}>
							{error && (
								<div
									className="alert py-3 mb-4"
									style={{
										backgroundColor: 'rgba(220, 53, 69, 0.1)',
										border: '1px solid rgba(220, 53, 69, 0.2)',
										borderRadius: '8px'
									}}
								>
									<p className="mb-0 small text-danger">{error}</p>
								</div>
							)}

							<div className="mb-3">
								<label className="form-label small text-white-50">Email</label>
								<input
									type="email"
									className={`form-control bg-dark text-white border-secondary ${errors.email ? 'is-invalid' : ''}`}
									placeholder="super@admin.com"
									style={{
										padding: '12px 16px',
										borderRadius: '8px'
									}}
									{...register('email')}
								/>
								{errors.email && (
									<div className="invalid-feedback">Email inválido</div>
								)}
							</div>

							<div className="mb-4">
								<label className="form-label small text-white-50">Senha</label>
								<input
									type="password"
									className={`form-control bg-dark text-white border-secondary ${errors.password ? 'is-invalid' : ''}`}
									placeholder="********"
									style={{
										padding: '12px 16px',
										borderRadius: '8px'
									}}
									{...register('password')}
								/>
								{errors.password && (
									<div className="invalid-feedback">Senha obrigatória</div>
								)}
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="btn btn-danger w-100 py-3"
								style={{ borderRadius: '8px' }}
							>
								{isLoading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
										Autenticando...
									</>
								) : (
									<>
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
										</svg>
										Acessar Painel
									</>
								)}
							</button>
						</form>

						{/* Footer */}
						<div className="mt-4 pt-4 border-top border-secondary text-center">
							<p className="mb-0 small text-white-50">
								Esta área é exclusiva para administradores do sistema.
								<br />
								Se você é um usuário comum, acesse o{' '}
								<a href="/login" className="text-info">
									login padrão
								</a>
								.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
