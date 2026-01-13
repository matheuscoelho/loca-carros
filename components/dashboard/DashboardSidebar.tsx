'use client'

import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar() {
	const t = useTranslations('dashboard')
	const tAuth = useTranslations('auth')
	const { data: session } = useSession()
	const pathname = usePathname()

	const handleLogout = async () => {
		await signOut({ redirect: true, callbackUrl: '/' })
	}

	const isActive = (path: string) => pathname === path

	const menuItems = [
		{ href: '/dashboard', icon: '🏠', label: t('title') },
		{ href: '/dashboard/my-rentals', icon: '🚗', label: t('myRentals') },
		{ href: '/dashboard/my-payments', icon: '💳', label: t('myPayments') },
		{ href: '/dashboard/favorites', icon: '❤️', label: t('favorites') },
		{ href: '/dashboard/notifications', icon: '🔔', label: t('notifications') },
		{ href: '/dashboard/profile', icon: '👤', label: t('profile') },
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
						className={`nav-link ${isActive(item.href) ? 'active text-primary' : 'text-dark'}`}
					>
						<i className="me-2">{item.icon}</i> {item.label}
					</Link>
				))}

				{session?.user?.role === 'admin' && (
					<>
						<hr />
						<Link href="/admin" className="nav-link text-warning">
							<i className="me-2">⚙️</i> {t('adminPanel')}
						</Link>
					</>
				)}

				<hr />

				<button
					onClick={handleLogout}
					className="nav-link text-danger border-0 bg-transparent text-start"
				>
					<i className="me-2">🚪</i> {tAuth('signOut')}
				</button>
			</nav>
		</div>
	)
}
