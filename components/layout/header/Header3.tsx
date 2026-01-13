'use client'
import dynamic from 'next/dynamic'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Locale, locales } from '@/i18n/config'
import Dropdown from 'react-bootstrap/Dropdown'

const localeNames: Record<Locale, string> = {
	en: 'EN',
	pt: 'PT'
}

const localeFullNames: Record<Locale, string> = {
	en: 'English',
	pt: 'Português'
}

export default function Header3({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const { data: session } = useSession()
	const locale = useLocale() as Locale
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const t = useTranslations('navigation')
	const ta = useTranslations('auth')

	const handleLocaleChange = async (newLocale: Locale) => {
		if (newLocale === locale) return
		await fetch('/api/locale', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: newLocale })
		})
		window.location.reload()
	}

	return (
		<>
			<header className={`header sticky-bar header-home-2 border-0 ${scroll ? 'stick' : ''}`}>
				<div className="container-fluid background-body">
					<div className="main-header">
						<div className="header-left">
							<div className="header-logo">
								<Link className="d-flex" href="/">
									<img className="light-mode" alt="Carento" src="/assets/imgs/template/logo.svg" />
									<img className="dark-mode" alt="Carento" src="/assets/imgs/template/logo-white.svg" />
								</Link>
							</div>
							<div className="header-nav">
								<nav className="nav-main-menu">
									<ul className="main-menu">
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
							<div className="header-right">
								<div className="d-none d-xxl-inline-block align-middle mr-15">
									<Dropdown className="d-inline-block align-middle mr-15 head-lang">
										<Dropdown.Toggle as="span" className="text-14-medium icon-list icon-account icon-lang" style={{ cursor: 'pointer' }}>
											<span className="text-14-medium arrow-down neutral-1000">{localeNames[locale]}</span>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-account" style={{visibility: 'visible'}}>
											<ul>
												{locales.map((loc) => (
													<li key={loc}>
														<button
															className={`text-sm-medium bg-transparent border-0 w-100 text-start ${loc === locale ? 'text-primary' : ''}`}
															onClick={() => handleLocaleChange(loc)}
															disabled={isPending}
															style={{ cursor: 'pointer' }}
														>
															{localeFullNames[loc]}
														</button>
													</li>
												))}
											</ul>
										</Dropdown.Menu>
									</Dropdown>
									{session ? (
										<Link className="btn btn-signin neutral-1000" href="/dashboard">
											<svg className="mb-1" xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" fill="none">
												<path d="M1 12C1 12 0 12 0 11C0 10 1 7 6 7C11 7 12 10 12 11C12 12 11 12 11 12H1ZM6 6C6.79565 6 7.55871 5.68393 8.12132 5.12132C8.68393 4.55871 9 3.79565 9 3C9 2.20435 8.68393 1.44129 8.12132 0.87868C7.55871 0.316071 6.79565 0 6 0C5.20435 0 4.44129 0.316071 3.87868 0.87868C3.31607 1.44129 3 2.20435 3 3C3 3.79565 3.31607 4.55871 3.87868 5.12132C4.44129 5.68393 5.20435 6 6 6Z" fill="#101010" />
											</svg>
											{session.user?.name?.split(' ')[0] || 'Dashboard'}
										</Link>
									) : (
										<Link className="btn btn-signin neutral-1000" href="/login">
											<svg className="mb-1" xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" fill="none">
												<path d="M1 12C1 12 0 12 0 11C0 10 1 7 6 7C11 7 12 10 12 11C12 12 11 12 11 12H1ZM6 6C6.79565 6 7.55871 5.68393 8.12132 5.12132C8.68393 4.55871 9 3.79565 9 3C9 2.20435 8.68393 1.44129 8.12132 0.87868C7.55871 0.316071 6.79565 0 6 0C5.20435 0 4.44129 0.316071 3.87868 0.87868C3.31607 1.44129 3 2.20435 3 3C3 3.79565 3.31607 4.55871 3.87868 5.12132C4.44129 5.68393 5.20435 6 6 6Z" fill="#101010" />
										</svg>
											{ta('signIn')}
										</Link>
									)}
									<div className="d-none d-xxl-inline-block align-middle mr-15">
									<ThemeSwitch/>
									</div>
								</div>
								<div className="burger-icon-2 burger-icon-white" onClick={handleOffcanvas}>
									<img src="/assets/imgs/template/icons/menu.svg" alt="Menu" />
								</div>
								<div className="burger-icon burger-icon-white" onClick={handleMobileMenu}>
									<span className="burger-icon-top" />
									<span className="burger-icon-mid"> </span>
									<span className="burger-icon-bottom" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

		</>
	)
}
