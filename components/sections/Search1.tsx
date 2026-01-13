'use client'
import Link from "next/link"
import HeroSearch from '../elements/HeroSearch'
import { useTranslations } from 'next-intl'

export default function Search1() {
	const t = useTranslations('vehicles')

	return (
		<>

			<section className="box-section box-search-advance-home10 background-100">
				<div className="container">
					<div className="box-search-advance background-card wow fadeIn">
						<div className="box-top-search">
							<div className="left-top-search">
								<Link className="category-link text-sm-bold btn-click active" href="#">{t('allCars')}</Link>
								<Link className="category-link text-sm-bold btn-click" href="#">{t('newCars')}</Link>
								<Link className="category-link text-sm-bold btn-click" href="#">{t('usedCars')}</Link>
							</div>
							<div className="right-top-search d-none d-md-flex">
								<Link className="text-sm-medium need-some-help" href="/contact">{t('needHelp')}</Link>
							</div>
						</div>
						<HeroSearch />
					</div>
				</div>
			</section>
		</>
	)
}
