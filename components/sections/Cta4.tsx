'use client'
import Link from "next/link"
import { useTranslations } from 'next-intl'

export default function Cta4() {
	const t = useTranslations('cta')

	return (
		<>

			<section className="section-cta-4 position-relative overflow-hidden">
				<div className="bg-shape" />
				<div className="container position-relative z-1">
					<div className="text-center">
						<span className="text-sm-bold bg-white p-3 rounded-12 wow fadeInDown">{t('bestSystem')}</span>
						<h4 className="mt-4 wow fadeInUp">
							{t('competitiveOffer')}
						</h4>
					</div>
					<div className="row mt-60">
						<div className="col-lg-4">
							<div className="bg-white rounded-12 p-5 d-flex flex-column gap-4">
								<span className="icon-shape icon_70 background-2 rounded-circle wow fadeIn">
									<img className="dark-invert" src="/assets/imgs/cta/cta-4/icon-1.svg" alt="Carento" />
								</span>
								<h6 className=" wow fadeInUp">{t('lookingForCar')}</h6>
								<p className="text-md-regular wow fadeInUp">{t('findPerfectCar')}</p>
								<Link className="btn btn-primary wow fadeInUp" href="/cars">
									{t('getStarted')}
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M12 19L19 12L12 5M19 12L5 12" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
						<div className="col-lg-4 text-center wow fadeInUp">
							<img src="/assets/imgs/cta/cta-4/car-center.png" alt="Carento" />
						</div>
						<div className="col-lg-4">
							<div className="bg-white rounded-12 p-5 d-flex flex-column gap-4">
								<span className="icon-shape icon_70 background-2 rounded-circle wow fadeIn">
									<img className="dark-invert" src="/assets/imgs/cta/cta-4/icon-2.svg" alt="Carento" />
								</span>
								<h6 className=" wow fadeInUp">{t('lookingForCar')}</h6>
								<p className="text-md-regular wow fadeInUp">{t('findPerfectCar')}</p>
								<Link className="btn btn-primary wow fadeInUp" href="/cars">
									{t('getStarted')}
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M12 19L19 12L12 5M19 12L5 12" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
