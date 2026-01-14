'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useBranding } from '@/contexts/BrandingContext'

export default function Footer1() {
	const t = useTranslations('footer')
	const { branding, socialMedia, general } = useBranding()

	return (
		<>
			<footer className="footer">
				<div className="container">
					<div className="footer-top">
						<div className="row align-items-center">
							<div className="col-lg-5 col-md-6 text-center text-md-start">
								<h5 className="color-white wow fadeInDown">{t('subscribe')}</h5>
							</div>
							<div className="col-lg-7 col-md-6 text-center text-md-end mt-md-0 mt-4">
								<div className="d-flex align-items-center justify-content-center justify-content-md-end">
									<form className="form-newsletter wow fadeInUp" action="#">
										<input className="form-control" type="text" placeholder={t('enterEmail')} />
										<input className="btn btn-brand-2" type="submit" defaultValue={t('subscribeButton')} />
									</form>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3 col-sm-12 footer-1">
							<div className="mt-20 mb-20">
								<Link className="d-flex" href="/">
									<img className="light-mode" alt={branding.siteName} src={branding.logoLight} style={{ width: branding.logoWidth, height: branding.logoHeight, objectFit: 'contain' }} />
									<img className="dark-mode" alt={branding.siteName} src={branding.logoDark} style={{ width: branding.logoWidth, height: branding.logoHeight, objectFit: 'contain' }} />
								</Link>
								<div className="box-info-contact mt-0">
									<p className="text-md neutral-400 icon-worktime">{t('hours')}</p>
									<p className="text-md neutral-400 icon-email">{general.contactEmail}</p>
								</div>
								<div className="box-need-help">
									<p className="need-help text-md-medium mb-5">{t('needHelp')}</p>
									<br /><Link className="heading-6 phone-support" href={`tel:${general.contactPhone.replace(/\D/g, '')}`}>{general.contactPhone}</Link>
								</div>
							</div>
						</div>
						<div className="col-md-2 col-xs-6 footer-3">
							<h6 className="text-linear-3">{t('company')}</h6>
							<ul className="menu-footer">
								<li><Link href="/about-us">{t('aboutUs')}</Link></li>
								<li><Link href="/term">{t('termsOfUse')}</Link></li>
								<li><Link href="/term">{t('privacyNotice')}</Link></li>
							</ul>
						</div>
						<div className="col-md-2 col-xs-6 footer-2">
							<h6 className="text-linear-3">{t('ourServices')}</h6>
							<ul className="menu-footer">
								<li><Link href="/cars-list-1">{t('carRental')}</Link></li>
								<li><Link href="/cars-list-1">{t('vehicleLeasing')}</Link></li>
								<li><Link href="/cars-list-1">{t('luxuryRentals')}</Link></li>
							</ul>
						</div>
						<div className="col-md-2 col-xs-6 footer-4">
							<h6 className="text-linear-3">{t('support')}</h6>
							<ul className="menu-footer">
								<li><Link href="/faqs">{t('helpCenter')}</Link></li>
								<li><Link href="/contact">{t('liveChat')}</Link></li>
								<li><Link href="/faqs">{t('howItWorks')}</Link></li>
							</ul>
						</div>
						<div className="col-md-3 col-xs-6 footer-5">
							<h6 className="text-linear-3">{t('quickLinks')}</h6>
							<ul className="menu-footer">
								<li><Link href="/">{t('home')}</Link></li>
								<li><Link href="/cars-list-1">{t('vehicles')}</Link></li>
								<li><Link href="/faqs">{t('faq')}</Link></li>
								<li><Link href="/contact">{t('contact')}</Link></li>
							</ul>
						</div>
					</div>
					<div className="footer-bottom mt-50">
						<div className="row align-items-center justify-content-center">
							<div className="col-md-6 text-md-start text-center mb-20">
								<p className="text-sm color-white">© {new Date().getFullYear()} {branding.siteName}. {t('allRightsReserved')}</p>
							</div>
							<div className="col-md-6 text-md-end text-center mb-20">
								<div className="d-flex align-items-center justify-content-center justify-content-md-end">
									<p className="text-lg-bold neutral-0 d-inline-block mr-10">{t('followUs')}</p>
									<div className="box-socials-footer d-inline-block">
										{socialMedia.instagram && (
											<Link className="icon-socials icon-instagram" href={socialMedia.instagram} target="_blank" rel="noopener noreferrer">
												<svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} viewBox="0 0 21 20" fill="none">
													<path d="M13.9146 1.6665H6.93127C3.89793 1.6665 2.0896 3.47484 2.0896 6.50817V13.4832C2.0896 16.5248 3.89793 18.3332 6.93127 18.3332H13.9063C16.9396 18.3332 18.7479 16.5248 18.7479 13.4915V6.50817C18.7563 3.47484 16.9479 1.6665 13.9146 1.6665ZM10.4229 13.2332C8.6396 13.2332 7.1896 11.7832 7.1896 9.99984C7.1896 8.2165 8.6396 6.7665 10.4229 6.7665C12.2063 6.7665 13.6563 8.2165 13.6563 9.99984C13.6563 11.7832 12.2063 13.2332 10.4229 13.2332ZM15.3563 5.73317C15.3146 5.83317 15.2563 5.92484 15.1813 6.00817C15.0979 6.08317 15.0063 6.1415 14.9063 6.18317C14.8063 6.22484 14.6979 6.24984 14.5896 6.24984C14.3646 6.24984 14.1563 6.1665 13.9979 6.00817C13.9229 5.92484 13.8646 5.83317 13.8229 5.73317C13.7813 5.63317 13.7563 5.52484 13.7563 5.4165C13.7563 5.30817 13.7813 5.19984 13.8229 5.09984C13.8646 4.9915 13.9229 4.90817 13.9979 4.82484C14.1896 4.63317 14.4813 4.5415 14.7479 4.59984C14.8063 4.60817 14.8563 4.62484 14.9063 4.64984C14.9563 4.6665 15.0063 4.6915 15.0563 4.72484C15.0979 4.74984 15.1396 4.7915 15.1813 4.82484C15.2563 4.90817 15.3146 4.9915 15.3563 5.09984C15.3979 5.19984 15.4229 5.30817 15.4229 5.4165C15.4229 5.52484 15.3979 5.63317 15.3563 5.73317Z" fill="white" />
												</svg>
											</Link>
										)}
										{socialMedia.facebook && (
											<Link className="icon-socials icon-facebook" href={socialMedia.facebook} target="_blank" rel="noopener noreferrer">
												<svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} viewBox="0 0 21 20" fill="none">
													<path d="M18.7563 13.4915C18.7563 16.5248 16.9479 18.3332 13.9146 18.3332H12.9229C12.4646 18.3332 12.0896 17.9582 12.0896 17.4998V12.6915C12.0896 12.4665 12.2729 12.2748 12.4979 12.2748L13.9646 12.2498C14.0813 12.2415 14.1813 12.1582 14.2063 12.0415L14.4979 10.4498C14.5229 10.2998 14.4063 10.1582 14.2479 10.1582L12.4729 10.1832C12.2396 10.1832 12.0563 9.99985 12.0479 9.77485L12.0146 7.73317C12.0146 7.59984 12.1229 7.48318 12.2646 7.48318L14.2646 7.44984C14.4063 7.44984 14.5146 7.34152 14.5146 7.19985L14.4813 5.19983C14.4813 5.05816 14.3729 4.94984 14.2313 4.94984L11.9813 4.98318C10.5979 5.00818 9.49794 6.1415 9.52294 7.52484L9.5646 9.8165C9.57293 10.0498 9.38961 10.2332 9.15628 10.2415L8.15627 10.2582C8.0146 10.2582 7.90628 10.3665 7.90628 10.5082L7.93127 12.0915C7.93127 12.2332 8.0396 12.3415 8.18126 12.3415L9.18127 12.3248C9.41461 12.3248 9.59792 12.5082 9.60626 12.7332L9.68125 17.4832C9.68959 17.9498 9.31459 18.3332 8.84792 18.3332H6.93126C3.89793 18.3332 2.0896 16.5248 2.0896 13.4832V6.50817C2.0896 3.47484 3.89793 1.6665 6.93126 1.6665H13.9146C16.9479 1.6665 18.7563 3.47484 18.7563 6.50817V13.4915Z" fill="white" />
												</svg>
											</Link>
										)}
										{socialMedia.twitter && (
											<Link className="icon-socials icon-twitter" href={socialMedia.twitter} target="_blank" rel="noopener noreferrer">
												<svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} viewBox="0 0 21 20" fill="none">
													<path d="M12.2847 8.46864L19.5701 0H17.8437L11.5178 7.3532L6.46535 0H0.637939L8.27824 11.1193L0.637939 20H2.36443L9.04472 12.2348L14.3805 20H20.2079L12.2843 8.46864H12.2847ZM9.92005 11.2173L9.14593 10.1101L2.98651 1.29967H5.63831L10.609 8.40994L11.3831 9.51718L17.8445 18.7594H15.1927L9.92005 11.2177V11.2173Z" fill="white" />
												</svg>
											</Link>
										)}
										{socialMedia.youtube && (
											<Link className="icon-socials icon-be" href={socialMedia.youtube} target="_blank" rel="noopener noreferrer">
												<svg width={21} height={15} viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M8.82393 10.736L13.9225 7.78881L8.82393 4.84165V10.736ZM20.1803 3.04389C20.308 3.50561 20.3964 4.12451 20.4554 4.91042C20.5242 5.69633 20.5536 6.37418 20.5536 6.96361L20.6126 7.78881C20.6126 9.94024 20.4554 11.5219 20.1803 12.5337C19.9347 13.4179 19.3649 13.9877 18.4808 14.2333C18.0191 14.361 17.1742 14.4494 15.8775 14.5083C14.6004 14.5771 13.4313 14.6066 12.3507 14.6066L10.7887 14.6655C6.67251 14.6655 4.10848 14.5083 3.09662 14.2333C2.21247 13.9877 1.64269 13.4179 1.39709 12.5337C1.26938 12.072 1.18097 11.4531 1.12203 10.6672C1.05326 9.8813 1.02379 9.20345 1.02379 8.61402L0.964844 7.78881C0.964844 5.63739 1.12203 4.05575 1.39709 3.04389C1.64269 2.15974 2.21247 1.58996 3.09662 1.34436C3.55834 1.21665 4.4032 1.12823 5.69995 1.06929C6.97705 1.00052 8.14609 0.971052 9.22671 0.971052L10.7887 0.912109C14.9049 0.912109 17.4689 1.06929 18.4808 1.34436C19.3649 1.58996 19.9347 2.15974 20.1803 3.04389Z" fill="true" />
												</svg>
											</Link>
										)}
										{socialMedia.linkedin && (
											<Link className="icon-socials icon-linkedin" href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
												<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 16 16" fill="white">
													<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
												</svg>
											</Link>
										)}
										{socialMedia.whatsapp && (
											<Link className="icon-socials icon-whatsapp" href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer">
												<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 16 16" fill="white">
													<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
												</svg>
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>

		</>
	)
}
