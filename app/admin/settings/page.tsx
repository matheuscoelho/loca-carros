'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface Settings {
	branding: {
		logoLight: string
		logoDark: string
		favicon: string
		siteName: string
		primaryColor: string
		secondaryColor: string
	}
	general: {
		siteDescription: string
		contactEmail: string
		contactPhone: string
		currency: string
		timezone: string
	}
	pricing: {
		taxRate: number
		serviceFee: number
		cancellationFee: number
		depositPercentage: number
	}
	notifications: {
		emailNotifications: boolean
		bookingConfirmation: boolean
		paymentReceived: boolean
		reminderBeforePickup: boolean
		reminderHours: number
	}
	business: {
		minRentalDays: number
		maxRentalDays: number
		advanceBookingDays: number
		pickupStartTime: string
		pickupEndTime: string
	}
}

const defaultSettings: Settings = {
	branding: {
		logoLight: '/assets/imgs/template/logo.svg',
		logoDark: '/assets/imgs/template/logo-white.svg',
		favicon: '/favicon.ico',
		siteName: 'Navegar Sistemas',
		primaryColor: '#70f46d',
		secondaryColor: '#8acfff',
	},
	general: {
		siteDescription: 'Serviço premium de aluguel de carros',
		contactEmail: 'contato@navegarsistemas.com.br',
		contactPhone: '+55 (11) 99999-9999',
		currency: 'BRL',
		timezone: 'America/Sao_Paulo'
	},
	pricing: {
		taxRate: 10,
		serviceFee: 5,
		cancellationFee: 15,
		depositPercentage: 20
	},
	notifications: {
		emailNotifications: true,
		bookingConfirmation: true,
		paymentReceived: true,
		reminderBeforePickup: true,
		reminderHours: 24
	},
	business: {
		minRentalDays: 1,
		maxRentalDays: 30,
		advanceBookingDays: 365,
		pickupStartTime: '08:00',
		pickupEndTime: '20:00'
	}
}

export default function AdminSettingsPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [settings, setSettings] = useState<Settings>(defaultSettings)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [activeTab, setActiveTab] = useState('branding')
	const [uploadingLogo, setUploadingLogo] = useState<'light' | 'dark' | 'favicon' | null>(null)

	const logoLightRef = useRef<HTMLInputElement>(null)
	const logoDarkRef = useRef<HTMLInputElement>(null)
	const faviconRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		fetchSettings()
	}, [])

	const fetchSettings = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/admin/settings')
			if (response.ok) {
				const data = await response.json()
				if (data.settings) {
					setSettings({
						branding: { ...defaultSettings.branding, ...data.settings.branding },
						general: { ...defaultSettings.general, ...data.settings.general },
						pricing: { ...defaultSettings.pricing, ...data.settings.pricing },
						notifications: { ...defaultSettings.notifications, ...data.settings.notifications },
						business: { ...defaultSettings.business, ...data.settings.business },
					})
				}
			}
		} catch (error) {
			console.error('Error fetching settings:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSave = async () => {
		setSaving(true)
		try {
			const response = await fetch('/api/admin/settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings),
			})

			if (response.ok) {
				setSaved(true)
				setTimeout(() => setSaved(false), 3000)
			} else {
				alert('Falha ao salvar configurações')
			}
		} catch (err) {
			console.error('Error saving settings:', err)
			alert('Falha ao salvar configurações')
		} finally {
			setSaving(false)
		}
	}

	const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('category', type)

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const data = await response.json()
				return data.url
			} else {
				const error = await response.json()
				alert(error.error || 'Falha no upload')
				return null
			}
		} catch (error) {
			console.error('Upload error:', error)
			alert('Erro no upload')
			return null
		}
	}

	const handleLogoLightChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setUploadingLogo('light')
		const url = await handleFileUpload(file, 'logo')
		if (url) {
			setSettings(prev => ({
				...prev,
				branding: { ...prev.branding, logoLight: url }
			}))
		}
		setUploadingLogo(null)
	}

	const handleLogoDarkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setUploadingLogo('dark')
		const url = await handleFileUpload(file, 'logo')
		if (url) {
			setSettings(prev => ({
				...prev,
				branding: { ...prev.branding, logoDark: url }
			}))
		}
		setUploadingLogo(null)
	}

	const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setUploadingLogo('favicon')
		const url = await handleFileUpload(file, 'favicon')
		if (url) {
			setSettings(prev => ({
				...prev,
				branding: { ...prev.branding, favicon: url }
			}))
		}
		setUploadingLogo(null)
	}

	const updateBranding = (field: keyof Settings['branding'], value: string) => {
		setSettings(prev => ({
			...prev,
			branding: { ...prev.branding, [field]: value }
		}))
	}

	const updateGeneral = (field: keyof Settings['general'], value: string) => {
		setSettings(prev => ({
			...prev,
			general: { ...prev.general, [field]: value }
		}))
	}

	const updatePricing = (field: keyof Settings['pricing'], value: number) => {
		setSettings(prev => ({
			...prev,
			pricing: { ...prev.pricing, [field]: value }
		}))
	}

	const updateNotifications = (field: keyof Settings['notifications'], value: boolean | number) => {
		setSettings(prev => ({
			...prev,
			notifications: { ...prev.notifications, [field]: value }
		}))
	}

	const updateBusiness = (field: keyof Settings['business'], value: string | number) => {
		setSettings(prev => ({
			...prev,
			business: { ...prev.business, [field]: value }
		}))
	}

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">{tCommon('loading')}</span>
				</div>
			</div>
		)
	}

	return (
		<div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">{t('settings.title')}</h1>
				<button
					className="btn btn-primary"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? (
						<>
							<span className="spinner-border spinner-border-sm me-2" />
							{t('settings.saving')}
						</>
					) : saved ? (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg me-2" viewBox="0 0 16 16">
								<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
							</svg>
							{t('settings.saved')}
						</>
					) : (
						t('settings.save')
					)}
				</button>
			</div>

			<div className="card border-0 shadow-sm">
				<div className="card-header bg-white border-0">
					<ul className="nav nav-tabs card-header-tabs">
						<li className="nav-item">
							<button
								className={`nav-link ${activeTab === 'branding' ? 'active' : ''}`}
								onClick={() => setActiveTab('branding')}
							>
								{t('settings.branding')}
							</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
								onClick={() => setActiveTab('general')}
							>
								{t('settings.general')}
							</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
								onClick={() => setActiveTab('pricing')}
							>
								{t('settings.pricing')}
							</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
								onClick={() => setActiveTab('notifications')}
							>
								{t('settings.notifications')}
							</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link ${activeTab === 'business' ? 'active' : ''}`}
								onClick={() => setActiveTab('business')}
							>
								{t('settings.businessRules')}
							</button>
						</li>
					</ul>
				</div>

				<div className="card-body">
					{/* Branding Settings */}
					{activeTab === 'branding' && (
						<div className="row g-4">
							{/* Logo Light Mode */}
							<div className="col-md-6">
								<label className="form-label">{t('settings.brandingFields.logoLight')}</label>
								<div className="border rounded p-3 text-center bg-light">
									<img
										src={settings.branding.logoLight}
										alt="Logo Light"
										style={{ maxHeight: '60px', maxWidth: '200px' }}
										className="mb-3"
									/>
									<div>
										<input
											type="file"
											ref={logoLightRef}
											onChange={handleLogoLightChange}
											accept="image/svg+xml,image/png,image/jpeg,image/webp"
											className="d-none"
										/>
										<button
											className="btn btn-sm btn-outline-primary"
											onClick={() => logoLightRef.current?.click()}
											disabled={uploadingLogo === 'light'}
										>
											{uploadingLogo === 'light' ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" />
													{t('settings.uploading')}
												</>
											) : (
												t('settings.changeLogo')
											)}
										</button>
									</div>
								</div>
								<small className="text-muted">{t('settings.brandingFields.logoLightHelp')}</small>
							</div>

							{/* Logo Dark Mode */}
							<div className="col-md-6">
								<label className="form-label">{t('settings.brandingFields.logoDark')}</label>
								<div className="border rounded p-3 text-center bg-dark">
									<img
										src={settings.branding.logoDark}
										alt="Logo Dark"
										style={{ maxHeight: '60px', maxWidth: '200px' }}
										className="mb-3"
									/>
									<div>
										<input
											type="file"
											ref={logoDarkRef}
											onChange={handleLogoDarkChange}
											accept="image/svg+xml,image/png,image/jpeg,image/webp"
											className="d-none"
										/>
										<button
											className="btn btn-sm btn-outline-light"
											onClick={() => logoDarkRef.current?.click()}
											disabled={uploadingLogo === 'dark'}
										>
											{uploadingLogo === 'dark' ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" />
													{t('settings.uploading')}
												</>
											) : (
												t('settings.changeLogo')
											)}
										</button>
									</div>
								</div>
								<small className="text-muted">{t('settings.brandingFields.logoDarkHelp')}</small>
							</div>

							{/* Favicon */}
							<div className="col-md-6">
								<label className="form-label">{t('settings.brandingFields.favicon')}</label>
								<div className="border rounded p-3 text-center bg-light">
									<img
										src={settings.branding.favicon}
										alt="Favicon"
										style={{ width: '32px', height: '32px' }}
										className="mb-3"
									/>
									<div>
										<input
											type="file"
											ref={faviconRef}
											onChange={handleFaviconChange}
											accept="image/x-icon,image/png,image/svg+xml"
											className="d-none"
										/>
										<button
											className="btn btn-sm btn-outline-primary"
											onClick={() => faviconRef.current?.click()}
											disabled={uploadingLogo === 'favicon'}
										>
											{uploadingLogo === 'favicon' ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" />
													{t('settings.uploading')}
												</>
											) : (
												t('settings.changeFavicon')
											)}
										</button>
									</div>
								</div>
								<small className="text-muted">{t('settings.brandingFields.faviconHelp')}</small>
							</div>

							{/* Site Name */}
							<div className="col-md-6">
								<label className="form-label">{t('settings.brandingFields.siteName')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.branding.siteName}
									onChange={(e) => updateBranding('siteName', e.target.value)}
								/>
							</div>

							{/* Primary Color */}
							<div className="col-md-6">
								<label className="form-label">{t('settings.brandingFields.primaryColor')}</label>
								<div className="input-group">
									<input
										type="color"
										className="form-control form-control-color"
										value={settings.branding.primaryColor}
										onChange={(e) => updateBranding('primaryColor', e.target.value)}
									/>
									<input
										type="text"
										className="form-control"
										value={settings.branding.primaryColor}
										onChange={(e) => updateBranding('primaryColor', e.target.value)}
										placeholder="#70f46d"
									/>
								</div>
								<small className="text-muted">{t('settings.brandingFields.primaryColorHelp')}</small>
							</div>

							{/* Secondary Color */}
							<div className="col-md-6">
								<label className="form-label">{t('settings.brandingFields.secondaryColor')}</label>
								<div className="input-group">
									<input
										type="color"
										className="form-control form-control-color"
										value={settings.branding.secondaryColor}
										onChange={(e) => updateBranding('secondaryColor', e.target.value)}
									/>
									<input
										type="text"
										className="form-control"
										value={settings.branding.secondaryColor}
										onChange={(e) => updateBranding('secondaryColor', e.target.value)}
										placeholder="#8acfff"
									/>
								</div>
								<small className="text-muted">{t('settings.brandingFields.secondaryColorHelp')}</small>
							</div>

							{/* Preview */}
							<div className="col-12">
								<label className="form-label">{t('settings.brandingFields.preview')}</label>
								<div className="border rounded p-4">
									<div className="row">
										<div className="col-md-6">
											<h6>{t('settings.brandingFields.previewLight')}</h6>
											<div className="bg-light p-3 rounded d-flex align-items-center gap-3">
												<img
													src={settings.branding.logoLight}
													alt="Logo"
													style={{ maxHeight: '40px' }}
												/>
												<button
													className="btn btn-sm"
													style={{ backgroundColor: settings.branding.primaryColor }}
												>
													{t('settings.brandingFields.sampleButton')}
												</button>
												<button
													className="btn btn-sm"
													style={{ backgroundColor: settings.branding.secondaryColor }}
												>
													{t('settings.brandingFields.sampleButton2')}
												</button>
											</div>
										</div>
										<div className="col-md-6">
											<h6>{t('settings.brandingFields.previewDark')}</h6>
											<div className="bg-dark p-3 rounded d-flex align-items-center gap-3">
												<img
													src={settings.branding.logoDark}
													alt="Logo"
													style={{ maxHeight: '40px' }}
												/>
												<button
													className="btn btn-sm"
													style={{ backgroundColor: settings.branding.primaryColor }}
												>
													{t('settings.brandingFields.sampleButton')}
												</button>
												<button
													className="btn btn-sm"
													style={{ backgroundColor: settings.branding.secondaryColor }}
												>
													{t('settings.brandingFields.sampleButton2')}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* General Settings */}
					{activeTab === 'general' && (
						<div className="row g-4">
							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.siteDescription')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.siteDescription}
									onChange={(e) => updateGeneral('siteDescription', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.contactEmail')}</label>
								<input
									type="email"
									className="form-control"
									value={settings.general.contactEmail}
									onChange={(e) => updateGeneral('contactEmail', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.contactPhone')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.contactPhone}
									onChange={(e) => updateGeneral('contactPhone', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.currency')}</label>
								<select
									className="form-select"
									value={settings.general.currency}
									onChange={(e) => updateGeneral('currency', e.target.value)}
								>
									<option value="USD">USD - US Dollar</option>
									<option value="EUR">EUR - Euro</option>
									<option value="GBP">GBP - British Pound</option>
									<option value="BRL">BRL - Brazilian Real</option>
								</select>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.timezone')}</label>
								<select
									className="form-select"
									value={settings.general.timezone}
									onChange={(e) => updateGeneral('timezone', e.target.value)}
								>
									<option value="America/New_York">Eastern Time (US)</option>
									<option value="America/Chicago">Central Time (US)</option>
									<option value="America/Denver">Mountain Time (US)</option>
									<option value="America/Los_Angeles">Pacific Time (US)</option>
									<option value="America/Sao_Paulo">Sao Paulo (Brazil)</option>
									<option value="Europe/London">London (UK)</option>
									<option value="Europe/Paris">Paris (France)</option>
								</select>
							</div>
						</div>
					)}

					{/* Pricing Settings */}
					{activeTab === 'pricing' && (
						<div className="row g-4">
							<div className="col-md-6">
								<label className="form-label">{t('settings.pricingFields.taxRate')}</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										value={settings.pricing.taxRate}
										onChange={(e) => updatePricing('taxRate', parseFloat(e.target.value) || 0)}
										min="0"
										max="100"
									/>
									<span className="input-group-text">%</span>
								</div>
								<small className="text-muted">{t('settings.pricingFields.taxRateHelp')}</small>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.pricingFields.serviceFee')}</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										value={settings.pricing.serviceFee}
										onChange={(e) => updatePricing('serviceFee', parseFloat(e.target.value) || 0)}
										min="0"
										max="100"
									/>
									<span className="input-group-text">%</span>
								</div>
								<small className="text-muted">{t('settings.pricingFields.serviceFeeHelp')}</small>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.pricingFields.cancellationFee')}</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										value={settings.pricing.cancellationFee}
										onChange={(e) => updatePricing('cancellationFee', parseFloat(e.target.value) || 0)}
										min="0"
										max="100"
									/>
									<span className="input-group-text">%</span>
								</div>
								<small className="text-muted">{t('settings.pricingFields.cancellationFeeHelp')}</small>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.pricingFields.depositPercentage')}</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										value={settings.pricing.depositPercentage}
										onChange={(e) => updatePricing('depositPercentage', parseFloat(e.target.value) || 0)}
										min="0"
										max="100"
									/>
									<span className="input-group-text">%</span>
								</div>
								<small className="text-muted">{t('settings.pricingFields.depositPercentageHelp')}</small>
							</div>
						</div>
					)}

					{/* Notification Settings */}
					{activeTab === 'notifications' && (
						<div className="row g-4">
							<div className="col-12">
								<div className="form-check form-switch">
									<input
										type="checkbox"
										className="form-check-input"
										id="emailNotifications"
										checked={settings.notifications.emailNotifications}
										onChange={(e) => updateNotifications('emailNotifications', e.target.checked)}
									/>
									<label className="form-check-label" htmlFor="emailNotifications">
										{t('settings.notificationFields.emailNotifications')}
									</label>
								</div>
							</div>
							<div className="col-12">
								<div className="form-check form-switch">
									<input
										type="checkbox"
										className="form-check-input"
										id="bookingConfirmation"
										checked={settings.notifications.bookingConfirmation}
										onChange={(e) => updateNotifications('bookingConfirmation', e.target.checked)}
									/>
									<label className="form-check-label" htmlFor="bookingConfirmation">
										{t('settings.notificationFields.bookingConfirmation')}
									</label>
								</div>
							</div>
							<div className="col-12">
								<div className="form-check form-switch">
									<input
										type="checkbox"
										className="form-check-input"
										id="paymentReceived"
										checked={settings.notifications.paymentReceived}
										onChange={(e) => updateNotifications('paymentReceived', e.target.checked)}
									/>
									<label className="form-check-label" htmlFor="paymentReceived">
										{t('settings.notificationFields.paymentReceived')}
									</label>
								</div>
							</div>
							<div className="col-12">
								<div className="form-check form-switch">
									<input
										type="checkbox"
										className="form-check-input"
										id="reminderBeforePickup"
										checked={settings.notifications.reminderBeforePickup}
										onChange={(e) => updateNotifications('reminderBeforePickup', e.target.checked)}
									/>
									<label className="form-check-label" htmlFor="reminderBeforePickup">
										{t('settings.notificationFields.reminderBeforePickup')}
									</label>
								</div>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.notificationFields.reminderHours')}</label>
								<input
									type="number"
									className="form-control"
									value={settings.notifications.reminderHours}
									onChange={(e) => updateNotifications('reminderHours', parseInt(e.target.value) || 24)}
									min="1"
									max="72"
								/>
							</div>
						</div>
					)}

					{/* Business Rules */}
					{activeTab === 'business' && (
						<div className="row g-4">
							<div className="col-md-6">
								<label className="form-label">{t('settings.businessFields.minRentalDays')}</label>
								<input
									type="number"
									className="form-control"
									value={settings.business.minRentalDays}
									onChange={(e) => updateBusiness('minRentalDays', parseInt(e.target.value) || 1)}
									min="1"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.businessFields.maxRentalDays')}</label>
								<input
									type="number"
									className="form-control"
									value={settings.business.maxRentalDays}
									onChange={(e) => updateBusiness('maxRentalDays', parseInt(e.target.value) || 30)}
									min="1"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.businessFields.advanceBookingDays')}</label>
								<input
									type="number"
									className="form-control"
									value={settings.business.advanceBookingDays}
									onChange={(e) => updateBusiness('advanceBookingDays', parseInt(e.target.value) || 365)}
									min="1"
								/>
								<small className="text-muted">{t('settings.businessFields.advanceBookingDaysHelp')}</small>
							</div>
							<div className="col-md-6"></div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.businessFields.pickupStartTime')}</label>
								<input
									type="time"
									className="form-control"
									value={settings.business.pickupStartTime}
									onChange={(e) => updateBusiness('pickupStartTime', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">{t('settings.businessFields.pickupEndTime')}</label>
								<input
									type="time"
									className="form-control"
									value={settings.business.pickupEndTime}
									onChange={(e) => updateBusiness('pickupEndTime', e.target.value)}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Info Card */}
			<div className="card border-0 shadow-sm mt-4 bg-light">
				<div className="card-body">
					<h6 className="text-muted mb-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle me-2" viewBox="0 0 16 16">
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
							<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
						</svg>
						{t('settings.aboutSettings')}
					</h6>
					<p className="mb-0 small text-muted">
						{t('settings.aboutSettingsDescription')}
					</p>
				</div>
			</div>
		</div>
	)
}
