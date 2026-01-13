'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Settings {
	general: {
		siteName: string
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
	general: {
		siteName: 'Carento',
		siteDescription: 'Premium car rental service',
		contactEmail: 'contact@carento.com',
		contactPhone: '+1 (555) 123-4567',
		currency: 'USD',
		timezone: 'America/New_York'
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
	const [activeTab, setActiveTab] = useState('general')

	useEffect(() => {
		// Load settings from localStorage
		const savedSettings = localStorage.getItem('carento_admin_settings')
		if (savedSettings) {
			try {
				setSettings(JSON.parse(savedSettings))
			} catch {
				setSettings(defaultSettings)
			}
		}
		setLoading(false)
	}, [])

	const handleSave = async () => {
		setSaving(true)
		try {
			// Save to localStorage
			localStorage.setItem('carento_admin_settings', JSON.stringify(settings))
			setSaved(true)
			setTimeout(() => setSaved(false), 3000)
		} catch (err) {
			console.error('Error saving settings:', err)
			alert('Failed to save settings')
		} finally {
			setSaving(false)
		}
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
							Saving...
						</>
					) : saved ? (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg me-2" viewBox="0 0 16 16">
								<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
							</svg>
							Saved!
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
								Business Rules
							</button>
						</li>
					</ul>
				</div>

				<div className="card-body">
					{/* General Settings */}
					{activeTab === 'general' && (
						<div className="row g-4">
							<div className="col-md-6">
								<label className="form-label">Site Name</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.siteName}
									onChange={(e) => updateGeneral('siteName', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Site Description</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.siteDescription}
									onChange={(e) => updateGeneral('siteDescription', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Contact Email</label>
								<input
									type="email"
									className="form-control"
									value={settings.general.contactEmail}
									onChange={(e) => updateGeneral('contactEmail', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Contact Phone</label>
								<input
									type="text"
									className="form-control"
									value={settings.general.contactPhone}
									onChange={(e) => updateGeneral('contactPhone', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Currency</label>
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
								<label className="form-label">Timezone</label>
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
								<label className="form-label">Tax Rate (%)</label>
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
								<small className="text-muted">Applied to all rentals</small>
							</div>
							<div className="col-md-6">
								<label className="form-label">Service Fee (%)</label>
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
								<small className="text-muted">Platform service fee</small>
							</div>
							<div className="col-md-6">
								<label className="form-label">Cancellation Fee (%)</label>
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
								<small className="text-muted">Fee charged for cancellations</small>
							</div>
							<div className="col-md-6">
								<label className="form-label">Deposit Percentage (%)</label>
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
								<small className="text-muted">Security deposit required</small>
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
										Enable Email Notifications
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
										Send Booking Confirmation Emails
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
										Send Payment Confirmation Emails
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
										Send Pickup Reminder Emails
									</label>
								</div>
							</div>
							<div className="col-md-6">
								<label className="form-label">Reminder Hours Before Pickup</label>
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
								<label className="form-label">Minimum Rental Days</label>
								<input
									type="number"
									className="form-control"
									value={settings.business.minRentalDays}
									onChange={(e) => updateBusiness('minRentalDays', parseInt(e.target.value) || 1)}
									min="1"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Maximum Rental Days</label>
								<input
									type="number"
									className="form-control"
									value={settings.business.maxRentalDays}
									onChange={(e) => updateBusiness('maxRentalDays', parseInt(e.target.value) || 30)}
									min="1"
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Advance Booking Days</label>
								<input
									type="number"
									className="form-control"
									value={settings.business.advanceBookingDays}
									onChange={(e) => updateBusiness('advanceBookingDays', parseInt(e.target.value) || 365)}
									min="1"
								/>
								<small className="text-muted">How far in advance can customers book</small>
							</div>
							<div className="col-md-6"></div>
							<div className="col-md-6">
								<label className="form-label">Pickup Start Time</label>
								<input
									type="time"
									className="form-control"
									value={settings.business.pickupStartTime}
									onChange={(e) => updateBusiness('pickupStartTime', e.target.value)}
								/>
							</div>
							<div className="col-md-6">
								<label className="form-label">Pickup End Time</label>
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
						About Settings
					</h6>
					<p className="mb-0 small text-muted">
						Settings are currently stored in your browser's local storage.
						Changes are saved per device and will be lost if you clear browser data.
						For a production environment, these settings should be stored in the database.
					</p>
				</div>
			</div>
		</div>
	)
}
