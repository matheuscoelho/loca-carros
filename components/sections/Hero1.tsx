'use client'
import { useTranslations } from 'next-intl'

export default function Hero1() {
	const t = useTranslations('vehicles')

	return (
		<>
			<section className="box-section block-banner-home1 position-relative">
				<div className="container position-relative z-1">
					<p className="text-primary text-md-bold wow fadeInUp">{t('findPerfectCar')}</p>
					<h1 className="color-white mb-35 wow fadeInUp">{t('lookingForVehicle')} <br className="d-none d-lg-block" />{t('perfectSpot')}</h1>
					<ul className="list-ticks-green">
						<li className="wow fadeInUp" data-wow-delay="0.1s">{t('highQuality')}</li>
						<li className="wow fadeInUp" data-wow-delay="0.2s">{t('premiumServices')}</li>
						<li className="wow fadeInUp" data-wow-delay="0.4s">{t('roadSideSupport')}</li>
					</ul>
				</div>
				<div className="bg-shape z-0" />
			</section>
		</>
	)
}
