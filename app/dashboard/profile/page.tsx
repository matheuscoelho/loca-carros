'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"

export default function Profile() {
	const t = useTranslations('dashboard')
	const tAuth = useTranslations('auth')
	const tCommon = useTranslations('common')
	const { data: session, status, update } = useSession()
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

	const [formData, setFormData] = useState({
		name: session?.user?.name || '',
		email: session?.user?.email || '',
		phone: '',
	})

	if (status === 'loading') {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">{tCommon('loading')}</span>
						</div>
						<p className="mt-3">{tCommon('loading')}</p>
					</div>
				</div>
			</Layout>
		)
	}

	if (!session) {
		router.push('/login')
		return null
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSaving(true)
		setMessage(null)

		try {
			const response = await fetch('/api/users/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				setMessage({ type: 'success', text: tCommon('success') })
				setIsEditing(false)
				await update({ name: formData.name })
			} else {
				setMessage({ type: 'error', text: tCommon('error') })
			}
		} catch (error) {
			setMessage({ type: 'error', text: tCommon('error') })
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<div className="row">
					<div className="col-lg-3 mb-4">
						<DashboardSidebar />
					</div>

					<div className="col-lg-9">
						<div className="border rounded-3 p-4">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h4 className="mb-0">{t('profile')}</h4>
								{!isEditing && (
									<button
										className="btn btn-outline-primary btn-sm"
										onClick={() => setIsEditing(true)}
									>
										{tCommon('edit')}
									</button>
								)}
							</div>

							{message && (
								<div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
									{message.text}
								</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="form-label">{tAuth('name')}</label>
										<input
											type="text"
											className="form-control"
											name="name"
											value={formData.name || session?.user?.name || ''}
											onChange={handleInputChange}
											disabled={!isEditing}
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{tAuth('email')}</label>
										<input
											type="email"
											className="form-control"
											name="email"
											value={session?.user?.email || ''}
											disabled
										/>
										<small className="text-muted">{t('emailCannotChange')}</small>
									</div>
									<div className="col-md-6">
										<label className="form-label">{tAuth('phone')}</label>
										<input
											type="tel"
											className="form-control"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											disabled={!isEditing}
											placeholder={tAuth('phone')}
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{t('role')}</label>
										<input
											type="text"
											className="form-control"
											value={session?.user?.role === 'admin' ? t('admin') : t('client')}
											disabled
										/>
									</div>
								</div>

								{isEditing && (
									<div className="mt-4 d-flex gap-2">
										<button
											type="submit"
											className="btn btn-primary"
											disabled={isSaving}
										>
											{isSaving ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
													{tCommon('loading')}
												</>
											) : (
												tCommon('save')
											)}
										</button>
										<button
											type="button"
											className="btn btn-outline-secondary"
											onClick={() => {
												setIsEditing(false)
												setFormData({
													name: session?.user?.name || '',
													email: session?.user?.email || '',
													phone: '',
												})
											}}
										>
											{tCommon('cancel')}
										</button>
									</div>
								)}
							</form>

							<hr className="my-4" />

							<h5 className="mb-3">{t('accountSecurity')}</h5>
							<button className="btn btn-outline-warning" disabled>
								{t('changePassword')}
							</button>
							<p className="text-muted small mt-2">
								{t('passwordChangeSoon')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
