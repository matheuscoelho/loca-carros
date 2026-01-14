'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import ColorPicker from '@/components/ui/ColorPicker'

interface Settings {
	branding: {
		logoLight: string
		logoDark: string
		logoWidth: number
		logoHeight: number
		favicon: string
		siteName: string
		primaryColor: string
		secondaryColor: string
		accentColor: string
		successColor: string
		warningColor: string
		dangerColor: string
		backgroundColor: string
		textColor: string
	}
	socialMedia: {
		instagram: string
		facebook: string
		twitter: string
		youtube: string
		linkedin: string
		whatsapp: string
	}
	general: {
		siteDescription: string
		siteTitle: string
		contactEmail: string
		contactPhone: string
		whatsappNumber: string
		address: string
		city: string
		state: string
		zipCode: string
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
		logoWidth: 150,
		logoHeight: 40,
		favicon: '/favicon.ico',
		siteName: 'Navegar Sistemas',
		primaryColor: '#70f46d',
		secondaryColor: '#8acfff',
		accentColor: '#ffc700',
		successColor: '#34d674',
		warningColor: '#ffc107',
		dangerColor: '#ff2e00',
		backgroundColor: '#ffffff',
		textColor: '#101010',
	},
	socialMedia: {
		instagram: '',
		facebook: '',
		twitter: '',
		youtube: '',
		linkedin: '',
		whatsapp: '',
	},
	general: {
		siteDescription: 'Serviço premium de aluguel de carros',
		siteTitle: 'Navegar Sistemas - Aluguel de Carros',
		contactEmail: 'contato@navegarsistemas.com.br',
		contactPhone: '+55 (11) 99999-9999',
		whatsappNumber: '+5511999999999',
		address: '',
		city: '',
		state: '',
		zipCode: '',
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
						socialMedia: { ...defaultSettings.socialMedia, ...data.settings.socialMedia },
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
				alert(t('settings.saveError'))
			}
		} catch (err) {
			console.error('Error saving settings:', err)
			alert(t('settings.saveError'))
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
				alert(error.error || t('settings.uploadFailed'))
				return null
			}
		} catch (error) {
			console.error('Upload error:', error)
			alert(t('settings.uploadError'))
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

	const updateBranding = (field: keyof Settings['branding'], value: string | number) => {
		setSettings(prev => ({
			...prev,
			branding: { ...prev.branding, [field]: value }
		}))
	}

	const updateSocialMedia = (field: keyof Settings['socialMedia'], value: string) => {
		setSettings(prev => ({
			...prev,
			socialMedia: { ...prev.socialMedia, [field]: value }
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

	// Funções de restaurar padrões
	const resetColors = () => {
		if (confirm(t('settings.brandingFields.confirmResetColors'))) {
			setSettings(prev => ({
				...prev,
				branding: {
					...prev.branding,
					primaryColor: defaultSettings.branding.primaryColor,
					secondaryColor: defaultSettings.branding.secondaryColor,
					accentColor: defaultSettings.branding.accentColor,
					successColor: defaultSettings.branding.successColor,
					warningColor: defaultSettings.branding.warningColor,
					dangerColor: defaultSettings.branding.dangerColor,
					backgroundColor: defaultSettings.branding.backgroundColor,
					textColor: defaultSettings.branding.textColor,
				}
			}))
		}
	}

	const resetSocialMedia = () => {
		if (confirm(t('settings.brandingFields.confirmClearSocial'))) {
			setSettings(prev => ({
				...prev,
				socialMedia: { ...defaultSettings.socialMedia }
			}))
		}
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

							{/* Logo Size */}
							<div className="col-md-3">
								<label className="form-label">{t('settings.brandingFields.logoWidth')}</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										value={settings.branding.logoWidth}
										onChange={(e) => updateBranding('logoWidth', parseInt(e.target.value) || 150)}
										min="50"
										max="500"
									/>
									<span className="input-group-text">px</span>
								</div>
								<small className="text-muted">{t('settings.brandingFields.logoWidthHelp')}</small>
							</div>

							<div className="col-md-3">
								<label className="form-label">{t('settings.brandingFields.logoHeight')}</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										value={settings.branding.logoHeight}
										onChange={(e) => updateBranding('logoHeight', parseInt(e.target.value) || 40)}
										min="20"
										max="200"
									/>
									<span className="input-group-text">px</span>
								</div>
								<small className="text-muted">{t('settings.brandingFields.logoHeightHelp')}</small>
							</div>

							{/* Divider - Colors Section */}
							<div className="col-12">
								<hr className="my-2" />
								<div className="d-flex justify-content-between align-items-center mb-3">
									<h6 className="text-muted mb-0">{t('settings.brandingFields.colorsSection')}</h6>
									<button
										type="button"
										className="btn btn-sm btn-outline-secondary"
										onClick={resetColors}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
											<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
											<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
										</svg>
										{t('settings.brandingFields.resetColors')}
									</button>
								</div>
							</div>

							{/* Primary Color */}
							<div className="col-md-4">
								<ColorPicker
									label={t('settings.brandingFields.primaryColor')}
									value={settings.branding.primaryColor}
									onChange={(value) => updateBranding('primaryColor', value)}
									helpText={t('settings.brandingFields.primaryColorHelp')}
								/>
							</div>

							{/* Secondary Color */}
							<div className="col-md-4">
								<ColorPicker
									label={t('settings.brandingFields.secondaryColor')}
									value={settings.branding.secondaryColor}
									onChange={(value) => updateBranding('secondaryColor', value)}
									helpText={t('settings.brandingFields.secondaryColorHelp')}
								/>
							</div>

							{/* Accent Color */}
							<div className="col-md-4">
								<ColorPicker
									label={t('settings.brandingFields.accentColor')}
									value={settings.branding.accentColor}
									onChange={(value) => updateBranding('accentColor', value)}
									helpText={t('settings.brandingFields.accentColorHelp')}
								/>
							</div>

							{/* Divider - Feedback Colors */}
							<div className="col-12">
								<hr className="my-2" />
								<h6 className="text-muted mb-3">{t('settings.brandingFields.feedbackColors')}</h6>
							</div>

							{/* Success Color */}
							<div className="col-md-4">
								<ColorPicker
									label={t('settings.brandingFields.successColor')}
									value={settings.branding.successColor}
									onChange={(value) => updateBranding('successColor', value)}
								/>
							</div>

							{/* Warning Color */}
							<div className="col-md-4">
								<ColorPicker
									label={t('settings.brandingFields.warningColor')}
									value={settings.branding.warningColor}
									onChange={(value) => updateBranding('warningColor', value)}
								/>
							</div>

							{/* Danger Color */}
							<div className="col-md-4">
								<ColorPicker
									label={t('settings.brandingFields.dangerColor')}
									value={settings.branding.dangerColor}
									onChange={(value) => updateBranding('dangerColor', value)}
								/>
							</div>

							{/* Divider - Background Colors */}
							<div className="col-12">
								<hr className="my-2" />
								<h6 className="text-muted mb-3">{t('settings.brandingFields.backgroundColors')}</h6>
							</div>

							{/* Background Color */}
							<div className="col-md-6">
								<ColorPicker
									label={t('settings.brandingFields.backgroundColor')}
									value={settings.branding.backgroundColor}
									onChange={(value) => updateBranding('backgroundColor', value)}
								/>
							</div>

							{/* Text Color */}
							<div className="col-md-6">
								<ColorPicker
									label={t('settings.brandingFields.textColor')}
									value={settings.branding.textColor}
									onChange={(value) => updateBranding('textColor', value)}
								/>
							</div>

							{/* Divider - Social Media */}
							<div className="col-12">
								<hr className="my-2" />
								<div className="d-flex justify-content-between align-items-center mb-3">
									<h6 className="text-muted mb-0">{t('settings.brandingFields.socialMedia')}</h6>
									<button
										type="button"
										className="btn btn-sm btn-outline-secondary"
										onClick={resetSocialMedia}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
											<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
											<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
										</svg>
										{t('settings.brandingFields.clearSocial')}
									</button>
								</div>
							</div>

							{/* Instagram */}
							<div className="col-md-6">
								<label className="form-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
										<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
									</svg>
									Instagram
								</label>
								<input
									type="url"
									className="form-control"
									value={settings.socialMedia.instagram}
									onChange={(e) => updateSocialMedia('instagram', e.target.value)}
									placeholder={t('settings.brandingFields.instagramPlaceholder')}
								/>
							</div>

							{/* Facebook */}
							<div className="col-md-6">
								<label className="form-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
										<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
									</svg>
									Facebook
								</label>
								<input
									type="url"
									className="form-control"
									value={settings.socialMedia.facebook}
									onChange={(e) => updateSocialMedia('facebook', e.target.value)}
									placeholder={t('settings.brandingFields.facebookPlaceholder')}
								/>
							</div>

							{/* Twitter/X */}
							<div className="col-md-6">
								<label className="form-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
										<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
									</svg>
									Twitter / X
								</label>
								<input
									type="url"
									className="form-control"
									value={settings.socialMedia.twitter}
									onChange={(e) => updateSocialMedia('twitter', e.target.value)}
									placeholder={t('settings.brandingFields.twitterPlaceholder')}
								/>
							</div>

							{/* YouTube */}
							<div className="col-md-6">
								<label className="form-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
										<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
									</svg>
									YouTube
								</label>
								<input
									type="url"
									className="form-control"
									value={settings.socialMedia.youtube}
									onChange={(e) => updateSocialMedia('youtube', e.target.value)}
									placeholder={t('settings.brandingFields.youtubePlaceholder')}
								/>
							</div>

							{/* LinkedIn */}
							<div className="col-md-6">
								<label className="form-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
										<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
									</svg>
									LinkedIn
								</label>
								<input
									type="url"
									className="form-control"
									value={settings.socialMedia.linkedin}
									onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
									placeholder={t('settings.brandingFields.linkedinPlaceholder')}
								/>
							</div>

							{/* WhatsApp */}
							<div className="col-md-6">
								<label className="form-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
										<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
									</svg>
									WhatsApp
								</label>
								<input
									type="url"
									className="form-control"
									value={settings.socialMedia.whatsapp}
									onChange={(e) => updateSocialMedia('whatsapp', e.target.value)}
									placeholder={t('settings.brandingFields.whatsappPlaceholder')}
								/>
								<small className="text-muted">{t('settings.brandingFields.whatsappHelp')}</small>
							</div>

							{/* Preview */}
							<div className="col-12">
								<hr className="my-2" />
								<h6 className="text-muted mb-3">{t('settings.brandingFields.preview')}</h6>
								<div className="border rounded p-4">
									{/* Logo Preview */}
									<div className="row mb-4">
										<div className="col-md-6">
											<small className="text-muted d-block mb-2">{t('settings.brandingFields.previewLight')}</small>
											<div className="bg-light p-3 rounded d-flex align-items-center gap-3">
												<img
													src={settings.branding.logoLight}
													alt="Logo"
													style={{
														width: `${settings.branding.logoWidth}px`,
														height: `${settings.branding.logoHeight}px`,
														objectFit: 'contain'
													}}
												/>
											</div>
										</div>
										<div className="col-md-6">
											<small className="text-muted d-block mb-2">{t('settings.brandingFields.previewDark')}</small>
											<div className="bg-dark p-3 rounded d-flex align-items-center gap-3">
												<img
													src={settings.branding.logoDark}
													alt="Logo"
													style={{
														width: `${settings.branding.logoWidth}px`,
														height: `${settings.branding.logoHeight}px`,
														objectFit: 'contain'
													}}
												/>
											</div>
										</div>
									</div>

									{/* Color Palette Preview */}
									<div className="row g-2 mb-4">
										{[
											{ key: 'primaryColor', label: t('settings.brandingFields.primaryColor') },
											{ key: 'secondaryColor', label: t('settings.brandingFields.secondaryColor') },
											{ key: 'accentColor', label: t('settings.brandingFields.accentColor') },
											{ key: 'successColor', label: t('settings.brandingFields.successColor') },
											{ key: 'warningColor', label: t('settings.brandingFields.warningColor') },
											{ key: 'dangerColor', label: t('settings.brandingFields.dangerColor') },
											{ key: 'backgroundColor', label: t('settings.brandingFields.backgroundColor') },
											{ key: 'textColor', label: t('settings.brandingFields.textColor') },
										].map((color) => (
											<div key={color.key} className="col-6 col-md-3">
												<div
													className="rounded-2 p-2 text-center"
													style={{
														backgroundColor: settings.branding[color.key as keyof typeof settings.branding] as string,
														border: '1px solid rgba(0,0,0,0.1)',
														minHeight: '60px'
													}}
												>
													<small
														className="fw-medium"
														style={{
															color: ['backgroundColor', 'warningColor'].includes(color.key) ? '#333' : '#fff',
															textShadow: ['backgroundColor', 'warningColor'].includes(color.key) ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'
														}}
													>
														{color.label}
													</small>
												</div>
											</div>
										))}
									</div>

									{/* Buttons Preview */}
									<div className="d-flex flex-wrap gap-2 mb-3">
										<button
											className="btn btn-sm"
											style={{ backgroundColor: settings.branding.primaryColor, color: '#fff' }}
										>
											{t('settings.brandingFields.sampleButton')}
										</button>
										<button
											className="btn btn-sm"
											style={{ backgroundColor: settings.branding.secondaryColor, color: '#fff' }}
										>
											{t('settings.brandingFields.sampleButton2')}
										</button>
										<button
											className="btn btn-sm"
											style={{ backgroundColor: settings.branding.accentColor, color: '#333' }}
										>
											{t('settings.brandingFields.accentButton')}
										</button>
										<button
											className="btn btn-sm"
											style={{ backgroundColor: settings.branding.successColor, color: '#fff' }}
										>
											{t('settings.brandingFields.successButton')}
										</button>
										<button
											className="btn btn-sm"
											style={{ backgroundColor: settings.branding.warningColor, color: '#333' }}
										>
											{t('settings.brandingFields.warningButton')}
										</button>
										<button
											className="btn btn-sm"
											style={{ backgroundColor: settings.branding.dangerColor, color: '#fff' }}
										>
											{t('settings.brandingFields.dangerButton')}
										</button>
									</div>

									{/* Page Background Preview */}
									<div
										className="rounded-3 p-3"
										style={{
											backgroundColor: settings.branding.backgroundColor,
											color: settings.branding.textColor,
											border: '1px solid #dee2e6'
										}}
									>
										<p className="mb-0 small">
											<strong>{t('settings.brandingFields.pagePreview')}</strong> {t('settings.brandingFields.pagePreviewText')}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* General Settings */}
					{activeTab === 'general' && (
						<div className="row g-4">
							{/* SEO Section */}
							<div className="col-12">
								<h6 className="text-muted mb-3">{t('settings.generalFields.seoSection')}</h6>
							</div>

							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.siteTitle')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.siteTitle}
									onChange={(e) => updateGeneral('siteTitle', e.target.value)}
									maxLength={60}
								/>
								<small className="text-muted">
									{settings.general.siteTitle.length}/60 {t('settings.generalFields.characters')}
								</small>
							</div>

							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.siteDescription')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.siteDescription}
									onChange={(e) => updateGeneral('siteDescription', e.target.value)}
									maxLength={160}
								/>
								<small className="text-muted">
									{settings.general.siteDescription.length}/160 {t('settings.generalFields.characters')}
								</small>
							</div>

							{/* Contact Section */}
							<div className="col-12">
								<hr className="my-2" />
								<h6 className="text-muted mb-3">{t('settings.generalFields.contactSection')}</h6>
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
									placeholder="+55 (11) 99999-9999"
								/>
							</div>

							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.whatsappNumber')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.whatsappNumber}
									onChange={(e) => updateGeneral('whatsappNumber', e.target.value)}
									placeholder="+5511999999999"
								/>
								<small className="text-muted">{t('settings.generalFields.whatsappNumberHelp')}</small>
							</div>

							{/* Address Section */}
							<div className="col-12">
								<hr className="my-2" />
								<h6 className="text-muted mb-3">{t('settings.generalFields.addressSection')}</h6>
							</div>

							<div className="col-12">
								<label className="form-label">{t('settings.generalFields.address')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.address}
									onChange={(e) => updateGeneral('address', e.target.value)}
									placeholder={t('settings.generalFields.addressPlaceholder')}
								/>
							</div>

							<div className="col-md-4">
								<label className="form-label">{t('settings.generalFields.city')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.city}
									onChange={(e) => updateGeneral('city', e.target.value)}
									placeholder={t('settings.generalFields.cityPlaceholder')}
								/>
							</div>

							<div className="col-md-4">
								<label className="form-label">{t('settings.generalFields.state')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.state}
									onChange={(e) => updateGeneral('state', e.target.value)}
									placeholder={t('settings.generalFields.statePlaceholder')}
								/>
							</div>

							<div className="col-md-4">
								<label className="form-label">{t('settings.generalFields.zipCode')}</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.zipCode}
									onChange={(e) => updateGeneral('zipCode', e.target.value)}
									placeholder={t('settings.generalFields.zipCodePlaceholder')}
								/>
							</div>

							{/* System Section */}
							<div className="col-12">
								<hr className="my-2" />
								<h6 className="text-muted mb-3">{t('settings.generalFields.systemSection')}</h6>
							</div>

							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.currency')}</label>
								<select
									className="form-select"
									value={settings.general.currency}
									onChange={(e) => updateGeneral('currency', e.target.value)}
								>
									<option value="USD">{t('settings.generalFields.currencies.usd')}</option>
									<option value="EUR">{t('settings.generalFields.currencies.eur')}</option>
									<option value="GBP">{t('settings.generalFields.currencies.gbp')}</option>
									<option value="BRL">{t('settings.generalFields.currencies.brl')}</option>
								</select>
							</div>

							<div className="col-md-6">
								<label className="form-label">{t('settings.generalFields.timezone')}</label>
								<select
									className="form-select"
									value={settings.general.timezone}
									onChange={(e) => updateGeneral('timezone', e.target.value)}
								>
									<option value="America/New_York">{t('settings.generalFields.timezones.newYork')}</option>
									<option value="America/Chicago">{t('settings.generalFields.timezones.chicago')}</option>
									<option value="America/Denver">{t('settings.generalFields.timezones.denver')}</option>
									<option value="America/Los_Angeles">{t('settings.generalFields.timezones.losAngeles')}</option>
									<option value="America/Sao_Paulo">{t('settings.generalFields.timezones.saoPaulo')}</option>
									<option value="Europe/London">{t('settings.generalFields.timezones.london')}</option>
									<option value="Europe/Paris">{t('settings.generalFields.timezones.paris')}</option>
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
