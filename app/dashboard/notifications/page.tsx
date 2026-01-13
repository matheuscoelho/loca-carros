'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import Link from 'next/link'

interface Notification {
	_id: string
	type: string
	title: string
	message: string
	data?: {
		bookingId?: string
		link?: string
	}
	read: boolean
	createdAt: string
}

export default function Notifications() {
	const t = useTranslations('dashboard')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()

	const [notifications, setNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (session?.user) {
			fetchNotifications()
		}
	}, [session])

	const fetchNotifications = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/notifications')

			if (response.ok) {
				const data = await response.json()
				setNotifications(data.notifications || [])
			}
		} catch (err) {
			console.error('Error fetching notifications:', err)
			setError('Erro ao carregar notificações')
		} finally {
			setLoading(false)
		}
	}

	const markAsRead = async (id: string) => {
		try {
			const response = await fetch(`/api/notifications/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ read: true })
			})

			if (response.ok) {
				setNotifications(prev =>
					prev.map(n => n._id === id ? { ...n, read: true } : n)
				)
			}
		} catch (err) {
			console.error('Error marking notification as read:', err)
		}
	}

	const markAllAsRead = async () => {
		try {
			const response = await fetch('/api/notifications/mark-all-read', {
				method: 'POST'
			})

			if (response.ok) {
				setNotifications(prev => prev.map(n => ({ ...n, read: true })))
			}
		} catch (err) {
			console.error('Error marking all notifications as read:', err)
		}
	}

	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 60) {
			return `${diffMins} min atrás`
		} else if (diffHours < 24) {
			return `${diffHours}h atrás`
		} else if (diffDays < 7) {
			return `${diffDays} dias atrás`
		} else {
			return date.toLocaleDateString('pt-BR')
		}
	}

	const getNotificationIcon = (type: string) => {
		const icons: Record<string, string> = {
			payment_received: '✅',
			payment_failed: '❌',
			booking_confirmed: '📅',
			booking_cancelled: '🚫',
			reminder: '⏰',
			default: '🔔'
		}
		return icons[type] || icons.default
	}

	const unreadCount = notifications.filter(n => !n.read).length

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
								<div className="d-flex align-items-center gap-2">
									<h4 className="mb-0">{t('notifications')}</h4>
									{unreadCount > 0 && (
										<span className="badge bg-danger rounded-pill">{unreadCount}</span>
									)}
								</div>
								{notifications.length > 0 && unreadCount > 0 && (
									<button
										className="btn btn-sm btn-outline-secondary"
										onClick={markAllAsRead}
									>
										Marcar todas como lidas
									</button>
								)}
							</div>

							{loading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">{tCommon('loading')}</span>
									</div>
									<p className="mt-3">Carregando notificações...</p>
								</div>
							) : error ? (
								<div className="alert alert-danger text-center">
									{error}
									<button className="btn btn-sm btn-primary ms-3" onClick={fetchNotifications}>
										Tentar novamente
									</button>
								</div>
							) : notifications.length === 0 ? (
								<div className="text-center py-5">
									<div className="mb-3" style={{ fontSize: '64px' }}>🔔</div>
									<h5 className="text-muted">{t('noRecentActivity')}</h5>
									<p className="text-muted">{t('activityWillAppear')}</p>
								</div>
							) : (
								<div className="list-group list-group-flush">
									{notifications.map((notification) => (
										<div
											key={notification._id}
											className={`list-group-item list-group-item-action py-3 ${!notification.read ? 'bg-light border-start border-primary border-3' : ''}`}
											onClick={() => !notification.read && markAsRead(notification._id)}
											style={{ cursor: !notification.read ? 'pointer' : 'default' }}
										>
											<div className="d-flex gap-3">
												<div className="flex-shrink-0" style={{ fontSize: '24px' }}>
													{getNotificationIcon(notification.type)}
												</div>
												<div className="flex-grow-1">
													<div className="d-flex justify-content-between align-items-start">
														<h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''}`}>
															{notification.title}
														</h6>
														<small className="text-muted">
															{formatTimeAgo(notification.createdAt)}
														</small>
													</div>
													<p className="mb-1 text-muted small">{notification.message}</p>
													{notification.data?.link && (
														<Link
															href={notification.data.link}
															className="btn btn-sm btn-link p-0"
															onClick={(e) => e.stopPropagation()}
														>
															Ver detalhes →
														</Link>
													)}
												</div>
												{!notification.read && (
													<div className="flex-shrink-0">
														<span className="badge bg-primary rounded-pill">Novo</span>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
