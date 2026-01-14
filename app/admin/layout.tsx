'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DemoBanner from '@/components/layout/DemoBanner'
import LocaleSwitcher from '@/components/LocaleSwitcher'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 992)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		} else if (status === 'authenticated' && session?.user?.role !== 'admin') {
			router.push('/dashboard')
		}
	}, [status, session, router])

	if (status === 'loading') {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		)
	}

	if (!session || session.user?.role !== 'admin') {
		return null
	}

	return (
		<>
		<DemoBanner />
		<div className="d-flex">
			<AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<main
				className="flex-grow-1"
				style={{
					marginLeft: isMobile ? 0 : '260px',
					minHeight: '100vh',
					backgroundColor: '#f8f9fa',
					transition: 'margin-left 0.3s ease'
				}}
			>
				{/* Header */}
				<div
					className="d-flex align-items-center justify-content-between px-3 py-2 bg-white border-bottom"
					style={{
						position: 'sticky',
						top: 0,
						zIndex: 1030
					}}
				>
					<div className="d-flex align-items-center">
						{isMobile && (
							<button
								onClick={() => setSidebarOpen(true)}
								className="btn btn-link text-dark p-2 me-2"
							>
								<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<line x1="3" y1="12" x2="21" y2="12" />
									<line x1="3" y1="6" x2="21" y2="6" />
									<line x1="3" y1="18" x2="21" y2="18" />
								</svg>
							</button>
						)}
						{isMobile && (
							<>
								<span className="fw-bold">Navegar Sistemas</span>
								<span className="badge bg-primary ms-2">Admin</span>
							</>
						)}
					</div>
					<div className="d-flex align-items-center gap-3">
						<LocaleSwitcher />
					</div>
				</div>
				<div className="p-4">
					{children}
				</div>
			</main>
		</div>
		</>
	)
}
