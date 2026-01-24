'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function DemoBanner() {
	const t = useTranslations('demoBanner')
	const [showBanner, setShowBanner] = useState<boolean | null>(null)

	useEffect(() => {
		// Buscar configuração do settings
		const fetchBannerConfig = async () => {
			try {
				const response = await fetch('/api/settings/public')
				if (response.ok) {
					const data = await response.json()
					// Usar configuração do settings, ou fallback para variável de ambiente
					const show = data.general?.showDemoBanner ??
						(process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true')
					setShowBanner(show)
				} else {
					// Fallback para variável de ambiente
					setShowBanner(process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true')
				}
			} catch {
				// Fallback para variável de ambiente
				setShowBanner(process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true')
			}
		}

		fetchBannerConfig()
	}, [])

	useEffect(() => {
		if (showBanner) {
			document.body.classList.add('has-demo-banner')
		} else {
			document.body.classList.remove('has-demo-banner')
		}
		return () => {
			document.body.classList.remove('has-demo-banner')
		}
	}, [showBanner])

	// Não renderizar enquanto carrega ou se não deve mostrar
	if (showBanner === null || !showBanner) return null

	return (
		<div className="demo-banner">
			<div className="demo-banner-row demo-banner-row-1">
				<span className="demo-banner-icon">⚠️</span>
				<strong>{t('title')}</strong>
				<span className="demo-banner-sep">—</span>
				<span>{t('description')}</span>
			</div>
			<div className="demo-banner-row demo-banner-row-2">
				<strong>{t('noPayments')}</strong>
				<span>{t('noRefunds')}</span>
			</div>
			<style jsx>{`
				.demo-banner {
					background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
					color: #fff;
					padding: 8px 12px;
					text-align: center;
					font-size: 12px;
					font-weight: 500;
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 16px;
					height: 40px;
					box-sizing: border-box;
				}
				.demo-banner-row {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
					flex-wrap: nowrap;
				}
				.demo-banner-icon {
					font-size: 14px;
				}
				.demo-banner-sep {
					opacity: 0.7;
				}
				@media (max-width: 768px) {
					.demo-banner {
						flex-direction: column;
						gap: 2px;
						padding: 8px 10px;
						font-size: 11px;
						height: 60px;
					}
					.demo-banner-row {
						gap: 4px;
					}
					.demo-banner-row-1 {
						flex-wrap: wrap;
					}
					.demo-banner-sep {
						display: none;
					}
				}
				@media (max-width: 400px) {
					.demo-banner {
						font-size: 10px;
					}
				}
			`}</style>
		</div>
	)
}
