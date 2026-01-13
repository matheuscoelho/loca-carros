'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import Link from 'next/link'

export default function Favorites() {
	const t = useTranslations('dashboard')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()

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
								<h4 className="mb-0">{t('favorites')}</h4>
							</div>

							<div className="text-center py-5">
								<div className="mb-3" style={{ fontSize: '64px' }}>❤️</div>
								<h5 className="text-muted">Seus favoritos aparecerão aqui</h5>
								<p className="text-muted mb-4">
									Encontre veículos que você gosta e adicione aos favoritos para acessar rapidamente depois.
								</p>
								<Link href="/cars-list-1" className="btn btn-primary">
									🚗 {t('findVehicle')}
								</Link>
							</div>

							{/* Feature Preview */}
							<div className="border-top pt-4 mt-4">
								<h6 className="text-muted mb-3">Em breve:</h6>
								<div className="row g-3">
									<div className="col-md-4">
										<div className="bg-light rounded-3 p-3 text-center">
											<span style={{ fontSize: '24px' }}>⭐</span>
											<p className="mb-0 small mt-2">Salvar veículos favoritos</p>
										</div>
									</div>
									<div className="col-md-4">
										<div className="bg-light rounded-3 p-3 text-center">
											<span style={{ fontSize: '24px' }}>🔔</span>
											<p className="mb-0 small mt-2">Alertas de disponibilidade</p>
										</div>
									</div>
									<div className="col-md-4">
										<div className="bg-light rounded-3 p-3 text-center">
											<span style={{ fontSize: '24px' }}>💰</span>
											<p className="mb-0 small mt-2">Alertas de promoções</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
