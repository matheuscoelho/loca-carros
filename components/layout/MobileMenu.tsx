'use client'
import Link from 'next/link'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useBranding } from '@/contexts/BrandingContext'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const t = useTranslations('navigation')
	const ta = useTranslations('auth')
	const { branding } = useBranding()
	const { data: session } = useSession()

	return (
		<>
			<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2 ${isMobileMenu ? 'sidebar-visible' : ''}`}>
				<PerfectScrollbar className="mobile-header-wrapper-inner">
					<div className="mobile-header-logo d-flex justify-content-between align-items-center">
						<div className="flex-grow-1 text-center">
							<Link className="d-inline-block" href="/">
								<img className="light-mode" alt={branding.siteName} src={branding.logoLight} style={{ maxWidth: '120px', maxHeight: '35px', objectFit: 'contain' }} />
								<img className="dark-mode" alt={branding.siteName} src={branding.logoDark} style={{ maxWidth: '120px', maxHeight: '35px', objectFit: 'contain' }} />
							</Link>
						</div>
						<div className="burger-icon burger-icon-white" onClick={handleMobileMenu} />
					</div>
					<div className="mobile-header-content-area">
						<div className="perfect-scroll">
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									<ul className="mobile-menu font-heading">
										<li>
											<Link href="/">{t('home')}</Link>
										</li>
										<li>
											<Link href="/cars-list-1">{t('vehicles')}</Link>
										</li>
										<li>
											<Link href="/about-us">{t('aboutUs')}</Link>
										</li>
										<li>
											<Link href="/faqs">{t('faqs')}</Link>
										</li>
										<li>
											<Link href="/contact">{t('contact')}</Link>
										</li>
									</ul>
								</nav>
							</div>
							<div className="mobile-header-border mt-4 pt-4">
								{session ? (
									<Link href="/dashboard" className="btn btn-primary w-100 mb-2">
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
				</PerfectScrollbar>
			</div>
			{isMobileMenu && <div className="body-overlay-1" onClick={handleMobileMenu} />}
		</>
	)
}
