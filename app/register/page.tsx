'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { registerSchema, RegisterInput } from '@/lib/validations/auth'

export default function Register() {
	const t = useTranslations('auth')
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			acceptTerms: false
		}
	})

	const onSubmit = async (data: RegisterInput) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			const result = await response.json()

			if (!response.ok) {
				if (response.status === 409) {
					setError(t('errors.emailExists'))
				} else {
					setError(result.error || t('errors.registerError'))
				}
				return
			}

			setSuccess(true)

			// Auto login after register
			setTimeout(async () => {
				await signIn('credentials', {
					email: data.email,
					password: data.password,
					redirect: true,
					callbackUrl: '/dashboard'
				})
			}, 1500)

		} catch (err) {
			setError(t('errors.registerError'))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<div className="row">
					<div className="col-lg-5 mx-auto">
						<div className="register-content border rounded-3 px-md-5 px-3 ptb-50">
							<div className="text-center">
								<p className="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center">{t('register')}</p>
								<h4 className="neutral-1000">{t('createAccount')}</h4>
							</div>
							<div className="form-login mt-30">
								<form onSubmit={handleSubmit(onSubmit)}>
									{error && (
										<div className="alert alert-danger mb-3" role="alert">
											{error}
										</div>
									)}

									{success && (
										<div className="alert alert-success mb-3" role="alert">
											{t('accountCreated')}
										</div>
									)}

									<div className="form-group">
										<input
											className={`form-control ${errors.name ? 'is-invalid' : ''}`}
											type="text"
											placeholder={t('name')}
											{...register('name')}
										/>
										{errors.name && (
											<div className="invalid-feedback">{t('errors.nameRequired')}</div>
										)}
									</div>

									<div className="form-group">
										<input
											className={`form-control email ${errors.email ? 'is-invalid' : ''}`}
											type="email"
											placeholder={t('email')}
											{...register('email')}
										/>
										{errors.email && (
											<div className="invalid-feedback">{t('errors.emailInvalid')}</div>
										)}
									</div>

									<div className="form-group">
										<input
											className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
											type="tel"
											placeholder={t('phone')}
											{...register('phone')}
										/>
									</div>

									<div className="form-group">
										<input
											className={`form-control password ${errors.password ? 'is-invalid' : ''}`}
											type="password"
											placeholder={t('passwordMin')}
											{...register('password')}
										/>
										{errors.password && (
											<div className="invalid-feedback">{t('errors.passwordMin')}</div>
										)}
									</div>

									<div className="form-group">
										<input
											className={`form-control password ${errors.confirmPassword ? 'is-invalid' : ''}`}
											type="password"
											placeholder={t('confirmPassword')}
											{...register('confirmPassword')}
										/>
										{errors.confirmPassword && (
											<div className="invalid-feedback">{t('errors.passwordsNoMatch')}</div>
										)}
									</div>

									<div className="form-group my-3">
										<div className="box-remember-forgot">
											<div className={`remeber-me d-flex align-items-center neutral-500 ${errors.acceptTerms ? 'text-danger' : ''}`}>
												<input
													className="cb-remember"
													type="checkbox"
													{...register('acceptTerms')}
												/>
												{t('acceptTerms')} <Link href="/term" className="ms-1 me-1 text-primary">{t('termsOfUse')}</Link> & <Link href="/term" className="ms-1 text-primary">{t('privacyPolicy')}</Link>
											</div>
											{errors.acceptTerms && (
												<div className="text-danger small mt-1">{t('errors.acceptTermsRequired')}</div>
											)}
										</div>
									</div>

									<div className="form-group mb-30">
										<button
											type="submit"
											className="btn btn-primary w-100"
											disabled={isLoading || success}
										>
											{isLoading ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
													{t('creatingAccount')}
												</>
											) : success ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
													{t('redirecting')}
												</>
											) : (
												<>
													{t('signUp')}
													<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</>
											)}
										</button>
									</div>

									<p className="text-md-medium neutral-500 text-center">{t('orConnectWith')}</p>

									<div className="box-button-logins">
										<button
											type="button"
											className="btn btn-login btn-google mr-10"
											onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
										>
											<img src="/assets/imgs/template/popup/google.svg" alt="Google" />
											<span className="text-sm-bold">Google</span>
										</button>
										<button type="button" className="btn btn-login mr-10" disabled>
											<img src="/assets/imgs/template/popup/facebook.svg" alt="Facebook" />
										</button>
										<button type="button" className="btn btn-login" disabled>
											<img src="/assets/imgs/template/popup/apple.svg" alt="Apple" />
										</button>
									</div>

									<p className="text-sm-medium neutral-500 text-center mt-70">
										{t('haveAccount')} <Link className="neutral-1000" href="/login">{t('loginHere')}</Link>
									</p>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
