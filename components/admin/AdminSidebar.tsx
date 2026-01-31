'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useBranding } from '@/contexts/BrandingContext'

const menuItems = [
	{
		key: 'dashboard',
		href: '/admin',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
	{
		key: 'vehicles',
		href: '/admin/vehicles',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
				<circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
			</svg>
		),
	},
	{
		key: 'bookings',
		href: '/admin/bookings',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
	{
		key: 'users',
		href: '/admin/users',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
	{
		key: 'payments',
		href: '/admin/payments',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
	{
		key: 'reviews',
		href: '/admin/reviews',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
	{
		key: 'reports',
		href: '/admin/reports',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
	{
		key: 'settings',
		href: '/admin/settings',
		icon: (
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
	},
]

interface AdminSidebarProps {
	isOpen?: boolean
	onClose?: () => void
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
	const pathname = usePathname()
	const t = useTranslations('admin')
	const { branding } = useBranding()
	const [isMobile, setIsMobile] = useState(false)
	const showBanner = process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true'
	const bannerHeight = showBanner ? '40px' : '0px'

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 992)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	// Close sidebar on route change in mobile
	useEffect(() => {
		if (isMobile && onClose) {
			onClose()
		}
	}, [pathname, isMobile, onClose])

	const isActive = (href: string) => {
		if (href === '/admin') {
			return pathname === '/admin'
		}
		return pathname.startsWith(href)
	}

	const handleLinkClick = () => {
		if (isMobile && onClose) {
			onClose()
		}
	}

	return (
		<>
			{/* Overlay for mobile */}
			{isMobile && isOpen && (
				<div
					className="sidebar-overlay"
					onClick={onClose}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(0,0,0,0.5)',
						zIndex: 1040,
						transition: 'opacity 0.3s ease'
					}}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`admin-sidebar bg-dark text-white ${isOpen ? 'open' : ''}`}
				style={{
					width: '260px',
					minHeight: `calc(100vh - ${bannerHeight})`,
					position: 'fixed',
					left: isMobile ? (isOpen ? 0 : '-260px') : 0,
					top: bannerHeight,
					zIndex: 1050,
					transition: 'left 0.3s ease',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				{/* Header */}
				<div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
					<Link href="/admin" className="d-flex align-items-center text-white text-decoration-none" onClick={handleLinkClick}>
						<img
							src={branding.logoDark}
							alt={branding.siteName}
							style={{
								maxWidth: '150px',
								maxHeight: '40px',
								objectFit: 'contain'
							}}
						/>
						<span className="badge bg-primary ms-2">Admin</span>
					</Link>
					{isMobile && (
						<button
							onClick={onClose}
							className="btn btn-link text-white p-0"
							style={{ fontSize: '24px', lineHeight: 1 }}
						>
							×
						</button>
					)}
				</div>

				{/* Navigation */}
				<nav className="p-3 flex-grow-1 overflow-auto">
					<ul className="nav flex-column">
						{menuItems.map((item) => (
							<li key={item.key} className="nav-item mb-1">
								<Link
									href={item.href}
									onClick={handleLinkClick}
									className={`nav-link d-flex align-items-center gap-3 rounded px-3 py-2 ${
										isActive(item.href)
											? 'bg-primary text-white'
											: 'text-white-50'
									}`}
									style={{
										transition: 'all 0.2s ease',
									}}
								>
									{item.icon}
									<span>{t(`menu.${item.key}`)}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* Footer */}
				<div className="p-3 border-top border-secondary">
					<Link
						href="/"
						onClick={handleLinkClick}
						className="nav-link d-flex align-items-center gap-3 text-white-50 px-3 py-2"
					>
						<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<span>{t('backToSite')}</span>
					</Link>
				</div>
			</aside>
		</>
	)
}
