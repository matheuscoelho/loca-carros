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
		<div style={{ height: '40px' }} />
		<div style={{
			background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
			color: '#fff',
			padding: '10px 20px',
			textAlign: 'center',
			fontSize: '13px',
			fontWeight: 500,
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			height: '40px',
			zIndex: 9999,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}>
			<span style={{ marginRight: '8px' }}>⚠️</span>
			<strong>{t('title')}</strong> - {t('description')}
			<strong> {t('noPayments')}</strong> {t('noRefunds')}
		</div>
		</>
	)
}
