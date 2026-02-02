'use client'
import Link from 'next/link'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslations } from 'next-intl'
import { useBranding } from '@/contexts/BrandingContext'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const t = useTranslations('navigation')
	const { branding } = useBranding()

	return (
		<>
			<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2 ${isMobileMenu ? 'sidebar-visible' : ''}`}>
				<PerfectScrollbar className="mobile-header-wrapper-inner">
					<div className="mobile-header-logo">
						<Link className="d-flex" href="/">
							<img className="light-mode" alt={branding.siteName} src={branding.logoLight} style={{ maxWidth: '150px', maxHeight: '40px', objectFit: 'contain' }} />
							<img className="dark-mode" alt={branding.siteName} src={branding.logoDark} style={{ maxWidth: '150px', maxHeight: '40px', objectFit: 'contain' }} />
						</Link>
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
						</div>
					</div>
				</PerfectScrollbar>
			</div>
			{isMobileMenu && <div className="body-overlay-1" onClick={handleMobileMenu} />}
		</>
	)
}
