'use client'

import { getContrastInfo, type WCAGLevel } from '@/lib/utils/contrast'

interface ContrastBadgeProps {
	foreground: string
	background: string
	showRatio?: boolean
	size?: 'sm' | 'md'
}

const levelConfig: Record<WCAGLevel, { label: string; labelEn: string; className: string; icon: string }> = {
	'AAA': {
		label: 'Excelente',
		labelEn: 'Excellent',
		className: 'bg-success text-white',
		icon: '✓✓'
	},
	'AA': {
		label: 'Bom',
		labelEn: 'Good',
		className: 'bg-success text-white',
		icon: '✓'
	},
	'AA-large': {
		label: 'Apenas texto grande',
		labelEn: 'Large text only',
		className: 'bg-warning text-dark',
		icon: '!'
	},
	'fail': {
		label: 'Contraste baixo',
		labelEn: 'Low contrast',
		className: 'bg-danger text-white',
		icon: '✗'
	}
}

export default function ContrastBadge({ foreground, background, showRatio = true, size = 'sm' }: ContrastBadgeProps) {
	const info = getContrastInfo(foreground, background)
	const config = levelConfig[info.level]

	const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'

	return (
		<div className="d-inline-flex align-items-center gap-2">
			<span
				className={`badge rounded-pill ${config.className} ${sizeClasses}`}
				title={`WCAG ${info.level}: ${config.label}`}
			>
				<span className="me-1">{config.icon}</span>
				{info.level}
				{showRatio && (
					<span className="ms-1 opacity-75">
						({info.ratio}:1)
					</span>
				)}
			</span>
		</div>
	)
}

interface ContrastPreviewProps {
	foreground: string
	background: string
	label?: string
}

export function ContrastPreview({ foreground, background, label }: ContrastPreviewProps) {
	const info = getContrastInfo(foreground, background)

	return (
		<div className="d-flex flex-column gap-1">
			{label && <small className="text-muted">{label}</small>}
			<div
				className="rounded p-2 d-flex align-items-center justify-content-between"
				style={{ backgroundColor: background }}
			>
				<span style={{ color: foreground, fontWeight: 500 }}>
					Texto de exemplo
				</span>
				<ContrastBadge foreground={foreground} background={background} />
			</div>
			{!info.passes && (
				<small className="text-danger">
					⚠️ Contraste insuficiente para texto normal (mínimo 4.5:1)
				</small>
			)}
		</div>
	)
}
