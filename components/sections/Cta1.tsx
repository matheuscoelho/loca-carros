'use client'
import Link from "next/link"
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ModalVideo from 'react-modal-video'

export default function Cta1() {
	const t = useTranslations('cta')
	const [isOpen, setOpen] = useState(false)

	return (
		<>

			<section className="box-cta-1 background-100 py-96">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-6 pe-lg-5 wow fadeInUp">
							<div className="card-video">
								<div className="card-image"><a className="btn btn-play popup-youtube" onClick={() => setOpen(true)} /><img src="/assets/imgs/cta/cta-1/video.png" alt="Carento" /></div>
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-4">
							<span className="btn btn-signin bg-white text-dark mb-4 wow fadeInUp">{t('bestSystem')}</span>
							<h4 className="mb-4 neutral-1000 wow fadeInUp">{t('competitiveOffer')}</h4>
							<p className="text-lg-medium neutral-500 mb-4 wow fadeInUp">{t('commitment')}</p>
							<div className="row">
								<div className="col-md-6">
									<ul className="list-ticks-green">
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.1s">{t('feature1')}</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.2s">{t('feature2')}</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.3s">{t('feature3')}</li>
									</ul>
								</div>
								<div className="col-md-6">
									<ul className="list-ticks-green wow fadeInUp">
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.1s">{t('feature4')}</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.2s">{t('feature5')}</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.3s">{t('feature6')}</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<ModalVideo channel='youtube' isOpen={isOpen} videoId="JXMWOmuR1hU" onClose={() => setOpen(false)} />
		</>
	)
}
