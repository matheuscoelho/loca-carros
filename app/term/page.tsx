'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslations } from 'next-intl'
export default function Term() {
	const t = useTranslations('terms')

	return (
		<>

			<Layout footerStyle={1}>
				<div>
					<div className="page-header pt-30 background-body">
						<div className="custom-container position-relative mx-auto">
							<div className="bg-overlay rounded-12 overflow-hidden">
								<img className="w-100 h-100 rounded-12 img-banner" src="/assets/imgs/page-header/banner5.png" alt="Iuri" />
							</div>
							<div className="container position-absolute z-1 top-50 start-50 translate-middle">
								<h2 className="text-white">{t('title')}</h2>
								<span className="text-white text-xl-medium">{t('lastUpdate')}</span>
							</div>
						</div>
					</div>
					<section className="box-section-term background-body pt-85 pb-85">
						<div className="container">
							<div className="row">
								<div className="col-lg-3 col-md-6 mb-lg-0 mb-4">
									<div className="sidebar rounded-3 border py-5 px-4">
										<div className="sidebar-menu">
											<h6 className="neutral-1000 mb-3">{t('tableOfContent')}</h6>
											<ul>
												<li className="mb-2"><Link href="#Acceptance" className="text-md-medium neutral-500">{t('acceptance.title')}</Link></li>
												<li className="mb-2"><Link href="#Services" className="text-md-medium neutral-500">{t('servicesProvided.title')}</Link></li>
												<li className="mb-2"><Link href="#User" className="text-md-medium neutral-500 active">{t('userResponsibilities.title')}</Link></li>
												<li className="mb-2"><Link href="#Account" className="text-md-medium neutral-500">{t('accountSecurity.title')}</Link></li>
												<li className="mb-2"><Link href="#Payment" className="text-md-medium neutral-500">{t('paymentAndFees.title')}</Link></li>
												<li className="mb-2"><Link href="#Cancellation" className="text-md-medium neutral-500">{t('cancellationAndRefunds.title')}</Link></li>
												<li className="mb-2"><Link href="#Intellectual" className="text-md-medium neutral-500">{t('intellectualProperty.title')}</Link></li>
												<li className="mb-2"><Link href="#Limitation" className="text-md-medium neutral-500">{t('limitationOfLiability.title')}</Link></li>
												<li className="mb-2"><Link href="#Privacy" className="text-md-medium neutral-500">{t('privacyPolicy.title')}</Link></li>
												<li className="mb-2"><Link href="#changetem" className="text-md-medium neutral-500">{t('changesToTerms.title')}</Link></li>
												<li className="mb-2"><Link href="#Governing" className="text-md-medium neutral-500">{t('governingLaw.title')}</Link></li>
												<li className="mb-2"><Link href="#Contact" className="text-md-medium neutral-500">{t('contactUs.title')}</Link></li>
											</ul>
										</div>
									</div>
								</div>
								<div className="col-lg-9 px-lg-5">
									<div className="d-flex flex-column gap-4">
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Acceptance">{t('acceptance.heading')}</h3>
											<p className="text-md-medium neutral-500">
												{t('acceptance.paragraph')}
											</p>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000">{t('servicesProvided.heading')}</h3>
											<p className="text-md-medium neutral-500">{t('servicesProvided.paragraph')}</p>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Responsibility">{t('userResponsibilities.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('userResponsibilities.accuracyLabel')} <span className="neutral-500"> {t('userResponsibilities.accuracyText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('userResponsibilities.lawfulUseLabel')} <span className="neutral-500"> {t('userResponsibilities.lawfulUseText')}</span></p>
												</li>
											</ul>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Account">{t('accountSecurity.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('accountSecurity.confidentialityLabel')} <span className="neutral-500"> {t('accountSecurity.confidentialityText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('accountSecurity.unauthorizedUseLabel')} <span className="neutral-500"> {t('accountSecurity.unauthorizedUseText')}</span></p>
												</li>
											</ul>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Payment">{t('paymentAndFees.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('paymentAndFees.paymentTermsLabel')} <span className="neutral-500"> {t('paymentAndFees.paymentTermsText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('paymentAndFees.feeChangesLabel')} <span className="neutral-500"> {t('paymentAndFees.feeChangesText')}</span></p>
												</li>
											</ul>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Cancellations">{t('cancellationAndRefunds.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000"> {t('cancellationAndRefunds.cancellationPolicyLabel')} <span className="neutral-500"> {t('cancellationAndRefunds.cancellationPolicyText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('cancellationAndRefunds.refundPolicyLabel')} <span className="neutral-500"> {t('cancellationAndRefunds.refundPolicyText')}</span></p>
												</li>
											</ul>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Limitation">{t('limitationOfLiability.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('limitationOfLiability.generalLimitationLabel')} <span className="neutral-500"> {t('limitationOfLiability.generalLimitationText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('limitationOfLiability.directDamagesLabel')} <span className="neutral-500"> {t('limitationOfLiability.directDamagesText')}</span></p>
												</li>
											</ul>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="Privacy">{t('privacyPolicy.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('privacyPolicy.commitmentLabel')} <span className="neutral-500"> {t('privacyPolicy.commitmentText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('privacyPolicy.consentLabel')} <span className="neutral-500"> {t('privacyPolicy.consentText')}</span></p>
												</li>
											</ul>
										</div>
										<div className="content">
											<h3 className="text-xl-bold mb-2 neutral-1000" id="changetem">{t('changesToTerms.heading')}</h3>
											<ul>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('changesToTerms.updatesLabel')} <span className="neutral-500">{t('changesToTerms.updatesText')}</span></p>
												</li>
												<li className="mb-2">
													<p className="text-md-medium neutral-1000">{t('changesToTerms.notificationLabel')} <span className="neutral-500"> {t('changesToTerms.notificationText')}</span></p>
												</li>
											</ul>
										</div>
										<span className="text-xl-medium border-top pt-4 neutral-1000">{t('lastUpdate')}</span>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>

			</Layout>
		</>
	)
}