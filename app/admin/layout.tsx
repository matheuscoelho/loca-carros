'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { data: session, status } = useSession()
	const router = useRouter()

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
		<div className="d-flex">
			<AdminSidebar />
			<main className="flex-grow-1" style={{ marginLeft: '260px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
				<div className="p-4">
					{children}
				</div>
			</main>
		</div>
	)
}
