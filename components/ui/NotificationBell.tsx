'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface Notification {
	_id: string
	type: 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'vehicle_available' | 'review_reminder' | 'system'
	title: string
	message: string
	read: boolean
	createdAt: string
	link?: string
}

const typeIcons: Record<string, React.ReactNode> = {
	booking_confirmed: (
		<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
			<polyline points="22,4 12,14.01 9,11.01" />
		</svg>
	),
	booking_cancelled: (
		<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	),
	payment_received: (
		<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<line x1="12" y1="1" x2="12" y2="23" />
			<path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
		</svg>
	),
	vehicle_available: (
		<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
			<circle cx="7" cy="17" r="2" />
			<circle cx="17" cy="17" r="2" />
		</svg>
	),
	review_reminder: (
		<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
		</svg>
	),
	system: (
		<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	)
}

const typeColors: Record<string, string> = {
	booking_confirmed: '#10b981',
	booking_cancelled: '#ef4444',
	payment_received: '#6366f1',
	vehicle_available: '#3b82f6',
	review_reminder: '#f59e0b',
	system: '#64748b'
}

interface NotificationBellProps {
	variant?: 'light' | 'dark'
}

export default function NotificationBell({ variant = 'light' }: NotificationBellProps) {
	const { data: session } = useSession()
	const t = useTranslations('notifications')
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [unreadCount, setUnreadCount] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (session?.user) {
			fetchNotifications()
			// Poll for new notifications every 30 seconds
			const interval = setInterval(fetchNotifications, 30000)
			return () => clearInterval(interval)
		}
	}, [session])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const fetchNotifications = async () => {
		try {
			const res = await fetch('/api/notifications?limit=5')
			if (res.ok) {
				const data = await res.json()
				setNotifications(data.notifications || [])
				setUnreadCount(data.unreadCount || 0)
			}
		} catch (error) {
			console.error('Error fetching notifications:', error)
		}
	}

	const markAsRead = async (id: string) => {
		try {
			await fetch(`/api/notifications/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ read: true })
			})
			setNotifications(prev =>
				prev.map(n => n._id === id ? { ...n, read: true } : n)
			)
			setUnreadCount(prev => Math.max(0, prev - 1))
		} catch (error) {
			console.error('Error marking notification as read:', error)
		}
	}

	const markAllAsRead = async () => {
		try {
			await fetch('/api/notifications/mark-all-read', { method: 'POST' })
			setNotifications(prev => prev.map(n => ({ ...n, read: true })))
			setUnreadCount(0)
		} catch (error) {
			console.error('Error marking all as read:', error)
		}
	}

	const formatTime = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return t('justNow')
		if (diffMins < 60) return `${diffMins}m`
		if (diffHours < 24) return `${diffHours}h`
		if (diffDays < 7) return `${diffDays}d`
		return date.toLocaleDateString()
	}

	if (!session?.user) {
		return null
	}

	const iconColor = variant === 'dark' ? '#ffffff' : '#334155'
	const bgColor = variant === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'

	return (
		<div className="notification-bell position-relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="btn p-2 position-relative"
				style={{
					background: bgColor,
					borderRadius: '50%',
					width: '40px',
					height: '40px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: 'none'
				}}
			>
				<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
					<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
					<path d="M13.73 21a2 2 0 01-3.46 0" />
				</svg>
				{unreadCount > 0 && (
					<span
						className="position-absolute"
						style={{
							top: '2px',
							right: '2px',
							background: '#ef4444',
							color: 'white',
							fontSize: '10px',
							fontWeight: 'bold',
							borderRadius: '50%',
							minWidth: '18px',
							height: '18px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '0 4px'
						}}
					>
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div
					className="notification-dropdown"
					style={{
						position: 'absolute',
						top: '50px',
						right: 0,
						width: '360px',
						maxHeight: '480px',
						background: 'white',
						borderRadius: '12px',
						boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
						zIndex: 1060,
						overflow: 'hidden'
					}}
				>
					{/* Header */}
					<div
						className="d-flex justify-content-between align-items-center px-4 py-3"
						style={{ borderBottom: '1px solid #e5e7eb' }}
					>
						<h6 className="mb-0">{t('title')}</h6>
						{unreadCount > 0 && (
							<button
								onClick={markAllAsRead}
								className="btn btn-sm btn-link text-primary p-0"
								style={{ textDecoration: 'none', fontSize: '13px' }}
							>
								{t('markAllRead')}
							</button>
						)}
					</div>

					{/* Notifications List */}
					<div style={{ maxHeight: '360px', overflowY: 'auto' }}>
						{notifications.length === 0 ? (
							<div className="text-center py-5">
								<svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mb-3">
									<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
									<path d="M13.73 21a2 2 0 01-3.46 0" />
								</svg>
								<p className="text-muted mb-0">{t('empty')}</p>
							</div>
						) : (
							notifications.map((notification) => (
								<div
									key={notification._id}
									onClick={() => !notification.read && markAsRead(notification._id)}
									className="notification-item"
									style={{
										padding: '14px 16px',
										borderBottom: '1px solid #f1f5f9',
										background: notification.read ? 'white' : '#f0f9ff',
										cursor: 'pointer',
										transition: 'background 0.2s'
									}}
								>
									<div className="d-flex gap-3">
										<div
											style={{
												width: '36px',
												height: '36px',
												borderRadius: '50%',
												background: `${typeColors[notification.type]}15`,
												color: typeColors[notification.type],
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0
											}}
										>
											{typeIcons[notification.type] || typeIcons.system}
										</div>
										<div className="flex-grow-1 min-width-0">
											<div className="d-flex justify-content-between align-items-start mb-1">
												<h6
													className="mb-0"
													style={{
														fontSize: '14px',
														fontWeight: notification.read ? 500 : 600,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap'
													}}
												>
													{notification.title}
												</h6>
												<span
													className="text-muted ms-2 flex-shrink-0"
													style={{ fontSize: '11px' }}
												>
													{formatTime(notification.createdAt)}
												</span>
											</div>
											<p
												className="mb-0 text-muted"
												style={{
													fontSize: '13px',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical'
												}}
											>
												{notification.message}
											</p>
										</div>
										{!notification.read && (
											<div
												style={{
													width: '8px',
													height: '8px',
													borderRadius: '50%',
													background: '#3b82f6',
													flexShrink: 0,
													marginTop: '4px'
												}}
											/>
										)}
									</div>
								</div>
							))
						)}
					</div>

					{/* Footer */}
					<div
						className="px-4 py-3"
						style={{ borderTop: '1px solid #e5e7eb', background: '#f8fafc' }}
					>
						<Link
							href="/dashboard/notifications"
							className="btn btn-outline-primary btn-sm w-100"
							onClick={() => setIsOpen(false)}
						>
							{t('viewAll')}
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
