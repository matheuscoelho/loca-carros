'use client'

import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

// SVG Icons
const HomeIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
		<polyline points="9 22 9 12 15 12 15 22"></polyline>
	</svg>
)

const CarIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
		<circle cx="7" cy="17" r="2"></circle>
		<circle cx="17" cy="17" r="2"></circle>
	</svg>
)

const CreditCardIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
		<line x1="1" y1="10" x2="23" y2="10"></line>
	</svg>
)

const HeartIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
	</svg>
)

const BellIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
		<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
	</svg>
)

const UserIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
		<circle cx="12" cy="7" r="4"></circle>
	</svg>
)

const SettingsIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="3"></circle>
		<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
	</svg>
)

const LogoutIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
		<polyline points="16 17 21 12 16 7"></polyline>
		<line x1="21" y1="12" x2="9" y2="12"></line>
	</svg>
)

interface MenuItem {
	href: string
	icon: ReactNode
	label: string
}

export default function DashboardSidebar() {
	const t = useTranslations('dashboard')
	const tAuth = useTranslations('auth')
	const { data: session } = useSession()
	const pathname = usePathname()

	const handleLogout = async () => {
		const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '/'
		await signOut({ redirect: true, callbackUrl: currentOrigin })
	}

	const isActive = (path: string) => pathname === path

	const menuItems: MenuItem[] = [
		{ href: '/dashboard', icon: <HomeIcon />, label: t('title') },
		{ href: '/dashboard/my-rentals', icon: <CarIcon />, label: t('myRentals') },
		{ href: '/dashboard/my-payments', icon: <CreditCardIcon />, label: t('myPayments') },
		{ href: '/dashboard/favorites', icon: <HeartIcon />, label: t('favorites') },
		{ href: '/dashboard/notifications', icon: <BellIcon />, label: t('notifications') },
		{ href: '/dashboard/profile', icon: <UserIcon />, label: t('profile') },
	]

	return (
		<div className="border rounded-3 p-4">
			<div className="text-center mb-4">
				<div
					className="avatar-placeholder bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
					style={{ width: '80px', height: '80px', fontSize: '32px' }}
				>
					{session?.user?.name?.charAt(0).toUpperCase() || 'U'}
				</div>
				<h5 className="mb-1">{session?.user?.name}</h5>
				<p className="text-muted small mb-0">{session?.user?.email}</p>
				<span className="badge bg-success mt-2">
					{session?.user?.role === 'admin' ? t('admin') : t('client')}
				</span>
			</div>

			<hr />

			<nav className="nav flex-column">
				{menuItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={`nav-link d-flex align-items-center ${isActive(item.href) ? 'active text-primary' : 'text-dark'}`}
					>
						<span className="me-2">{item.icon}</span> {item.label}
					</Link>
				))}

				{session?.user?.role === 'admin' && (
					<>
						<hr />
						<Link href="/admin" className="nav-link text-warning d-flex align-items-center">
							<span className="me-2"><SettingsIcon /></span> {t('adminPanel')}
						</Link>
					</>
				)}

				<hr />

				<button
					onClick={handleLogout}
					className="nav-link text-danger border-0 bg-transparent text-start d-flex align-items-center"
				>
					<span className="me-2"><LogoutIcon /></span> {tAuth('signOut')}
				</button>
			</nav>
		</div>
	)
}
