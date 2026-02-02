'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useBranding } from '@/contexts/BrandingContext'

export default function Offcanvas({ isOffcanvas, handleOffcanvas }: any) {
	const t = useTranslations('offcanvas')
	const ta = useTranslations('auth')
	const { branding, general } = useBranding()
	const { data: session } = useSession()

	return (
		<>
			<div className={`sidebar-canvas-wrapper perfect-scrollbar button-bg-2 ${isOffcanvas ? "sidebar-canvas-visible" : ""}`}>
				<div className="sidebar-canvas-container">
					<div className="sidebar-canvas-head d-flex justify-content-between align-items-center">
						<div className="sidebar-canvas-logo flex-grow-1 text-center">
							<Link className="d-inline-block" href="/">
								<img className="light-mode" alt={branding.siteName} src={branding.logoLight} style={{ maxWidth: '120px', maxHeight: '35px', objectFit: 'contain' }} />
								<img className="dark-mode" alt={branding.siteName} src={branding.logoDark} style={{ maxWidth: '120px', maxHeight: '35px', objectFit: 'contain' }} />
							</Link>
						</div>
						<div className="sidebar-canvas-lang">
							<a className="close-canvas" onClick={handleOffcanvas}> <img alt="Fechar" src="/assets/imgs/template/icons/close.png" /></a>
						</div>
					</div>
					<div className="sidebar-canvas-content">
						<div className="sidebar-banner">
							<div className="position-relative">
								<p className="text-xl-bold neutral-1000 mb-4">{t('quickLinks')}</p>
								<ul className="list-unstyled">
									<li className="mb-3">
										<Link href="/cars-list-1" className="text-md-bold neutral-1000 d-flex align-items-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
												<circle cx="7" cy="17" r="2"/>
												<circle cx="17" cy="17" r="2"/>
											</svg>
											{t('ourFleet')}
										</Link>
									</li>
									<li className="mb-3">
										<Link href="/about-us" className="text-md-bold neutral-1000 d-flex align-items-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<circle cx="12" cy="12" r="10"/>
												<path d="M12 16v-4"/>
												<path d="M12 8h.01"/>
											</svg>
											{t('aboutUs')}
										</Link>
									</li>
									<li className="mb-3">
										<Link href="/contact" className="text-md-bold neutral-1000 d-flex align-items-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
										</svg>
											{t('contact')}
										</Link>
									</li>
									<li className="mb-3">
										<Link href="/faqs" className="text-md-bold neutral-1000 d-flex align-items-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<circle cx="12" cy="12" r="10"/>
												<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
												<path d="M12 17h.01"/>
											</svg>
											{t('faq')}
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="box-contactus">
							<h6 className="title-contactus neutral-1000">{t('contactUs')}</h6>
							<div className="contact-info">
								<p className="hour-work-2 text-md-medium neutral-1000">{t('hours')}</p>
								<p className="email-2 text-md-medium neutral-1000">{general.contactEmail}</p>
							</div>
						</div>
						<div className="mt-4 pt-4 border-top">
							{session ? (
								<Link href="/dashboard" className="btn btn-primary w-100">
									<svg className="me-2" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M3 14C3 14 2 14 2 13C2 12 3 9 8 9C13 9 14 12 14 13C14 14 13 14 13 14H3ZM8 8C8.79565 8 9.55871 7.68393 10.1213 7.12132C10.6839 6.55871 11 5.79565 11 5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5C5 5.79565 5.31607 6.55871 5.87868 7.12132C6.44129 7.68393 7.20435 8 8 8Z" fill="currentColor" />
									</svg>
									{session.user?.name?.split(' ')[0] || 'Dashboard'}
								</Link>
							) : (
								<>
									<Link href="/login" className="btn btn-primary w-100 mb-2">
										{ta('signIn')}
									</Link>
									<Link href="/register" className="btn btn-outline-primary w-100">
										{ta('signUp')}
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			{isOffcanvas && (
				<div className="body-overlay-1" onClick={handleOffcanvas} />
			)}

		</>
	)
}
