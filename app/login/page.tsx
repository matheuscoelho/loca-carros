'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { loginSchema, LoginInput } from '@/lib/validations/auth'

export default function Login() {
	const t = useTranslations('auth')
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
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
				redirect: false,
			})

			if (result?.error) {
				setError(t('errors.invalidCredentials'))
			} else {
				router.push(callbackUrl)
				router.refresh()
			}
		} catch (err) {
			setError(t('errors.loginError'))
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
									<p className="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center">{t('signIn')}</p>
									<h4 className="neutral-1000">{t('welcomeBack')}</h4>
								</div>
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
												<div className="invalid-feedback">{t('errors.emailInvalid')}</div>
											)}
										</div>

										<div className="form-group">
											<input
												className={`form-control password ${errors.password ? 'is-invalid' : ''}`}
												type="password"
												placeholder={t('password')}
												{...register('password')}
											/>
											{errors.password && (
												<div className="invalid-feedback">{t('errors.passwordRequired')}</div>
											)}
										</div>

										<div className="form-group">
											<div className="box-remember-forgot">
												<div className="remeber-me">
													<label className="text-xs-medium neutral-500">
														<input className="cb-remember" type="checkbox" /> {t('rememberMe')}
													</label>
												</div>
												<div className="forgotpass">
													<Link className="text-xs-medium neutral-500" href="/forgot-password">
														{t('forgotPassword')}
													</Link>
												</div>
											</div>
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
														{t('signingIn')}
													</>
												) : (
													<>
														{t('signIn')}
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
												onClick={() => signIn('google', { callbackUrl })}
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
											{t('noAccount')} <Link className="neutral-1000" href="/register">{t('registerHere')}</Link>
										</p>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
