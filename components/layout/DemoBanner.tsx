'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function DemoBanner() {
	const t = useTranslations('demoBanner')
	const showBanner = process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true'

	useEffect(() => {
		if (showBanner) {
			document.body.classList.add('has-demo-banner')
		}
		return () => {
			document.body.classList.remove('has-demo-banner')
		}
	}, [showBanner])

	if (!showBanner) return null

	return (
		<>
		{/* Spacer para compensar o banner fixo */}
		<div className="demo-banner-spacer" />
		<div className="demo-banner">
			<div className="demo-banner-content">
				<span className="demo-banner-icon">⚠️</span>
				<strong className="demo-banner-title">{t('title')}</strong>
				<span className="demo-banner-separator">-</span>
				<span className="demo-banner-desc">{t('description')}</span>
			</div>
			<div className="demo-banner-warnings">
				<strong className="demo-banner-warning">{t('noPayments')}</strong>
				<span className="demo-banner-warning">{t('noRefunds')}</span>
			</div>
		</div>
		<style jsx>{`
			.demo-banner-spacer {
				height: 40px;
			}
			.demo-banner {
				background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
				color: #fff;
				padding: 8px 16px;
				text-align: center;
				font-size: 13px;
				font-weight: 500;
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				min-height: 40px;
				z-index: 9999;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				flex-wrap: wrap;
			}
			.demo-banner-content {
				display: flex;
				align-items: center;
				gap: 6px;
				flex-wrap: wrap;
				justify-content: center;
			}
			.demo-banner-warnings {
				display: flex;
				align-items: center;
				gap: 8px;
				flex-wrap: wrap;
				justify-content: center;
			}
			.demo-banner-icon {
				font-size: 14px;
			}
			.demo-banner-title {
				white-space: nowrap;
			}
			.demo-banner-warning {
				white-space: nowrap;
			}
			@media (max-width: 768px) {
				.demo-banner-spacer {
					height: 56px;
				}
				.demo-banner {
					min-height: 56px;
					padding: 6px 12px;
					font-size: 11px;
					flex-direction: column;
					gap: 2px;
				}
				.demo-banner-content {
					gap: 4px;
				}
				.demo-banner-warnings {
					gap: 6px;
					font-size: 10px;
				}
				.demo-banner-separator {
					display: none;
				}
			}
		`}</style>
		</>
	)
}
