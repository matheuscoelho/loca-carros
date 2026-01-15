'use client'

import { useRef, useState, useMemo } from 'react'
import { useLocale } from 'next-intl'
import {
	uiColors,
	generateHarmonicPalettes,
	type ColorPalette
} from '@/lib/utils/colorHarmony'

interface ColorPickerProps {
	label: string
	value: string
	onChange: (value: string) => void
	helpText?: string
	colorType?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'backgrounds' | 'texts'
}

export default function ColorPicker({ label, value, onChange, helpText, colorType }: ColorPickerProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const locale = useLocale()
	const [showSuggestions, setShowSuggestions] = useState(false)

	const handleClick = () => {
		inputRef.current?.click()
	}

	// Gera paletas harmônicas baseadas na cor atual
	const harmonicPalettes = useMemo(() => {
		return generateHarmonicPalettes(value)
	}, [value])

	// Cores sugeridas baseadas no tipo
	const suggestedColors = colorType ? uiColors[colorType] : uiColors.primary

	// Todas as cores rápidas (mais populares para UI)
	const quickColors = [
		'#2563eb', '#3b82f6', '#8b5cf6', '#06b6d4', // Blues/Cyans
		'#22c55e', '#16a34a', '#14b8a6', '#10b981', // Greens
		'#f59e0b', '#eab308', '#fbbf24', '#f97316', // Yellows/Oranges
		'#ef4444', '#dc2626', '#ec4899', '#f43f5e', // Reds/Pinks
		'#64748b', '#6b7280', '#0f172a', '#ffffff'  // Grays/Neutrals
	]

	return (
		<div>
			<label className="form-label">{label}</label>
			<div
				className="position-relative"
				style={{ cursor: 'pointer' }}
				onClick={handleClick}
			>
				{/* Caixa de cor grande e clicável */}
				<div
					className="rounded-3 d-flex align-items-center justify-content-center"
					style={{
						width: '100%',
						height: '80px',
						backgroundColor: value,
						border: '3px solid #dee2e6',
						boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
						transition: 'all 0.2s ease'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = '#0d6efd'
						e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,110,253,0.3)'
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = '#dee2e6'
						e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
					}}
				>
					{/* Ícone de edição */}
					<div
						className="d-flex align-items-center justify-content-center rounded-circle"
						style={{
							width: '36px',
							height: '36px',
							backgroundColor: 'rgba(255,255,255,0.9)',
							boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#333" viewBox="0 0 16 16">
							<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
						</svg>
					</div>
				</div>

				{/* Código da cor */}
				<div
					className="text-center mt-2"
					style={{
						fontFamily: 'monospace',
						fontSize: '13px',
						fontWeight: 600,
						color: '#495057'
					}}
				>
					{value.toUpperCase()}
				</div>

				{/* Input de cor escondido */}
				<input
					ref={inputRef}
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					style={{
						opacity: 0,
						position: 'absolute',
						width: '100%',
						height: '80px',
						top: 0,
						left: 0,
						cursor: 'pointer'
					}}
				/>
			</div>

			{/* Botão para mostrar sugestões */}
			<button
				type="button"
				className="btn btn-sm btn-link p-0 mt-2 text-decoration-none"
				onClick={(e) => {
					e.stopPropagation()
					setShowSuggestions(!showSuggestions)
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
					<path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
					<path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"/>
				</svg>
				{showSuggestions
					? (locale === 'pt' ? 'Ocultar sugestões' : 'Hide suggestions')
					: (locale === 'pt' ? 'Ver sugestões de cores' : 'View color suggestions')
				}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					fill="currentColor"
					className="ms-1"
					viewBox="0 0 16 16"
					style={{
						transform: showSuggestions ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform 0.2s ease'
					}}
				>
					<path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
				</svg>
			</button>

			{/* Painel de sugestões */}
			{showSuggestions && (
				<div
					className="mt-3 p-3 border rounded bg-light"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Cores rápidas */}
					<div className="mb-3">
						<small className="text-muted fw-medium d-block mb-2">
							{locale === 'pt' ? 'Cores Populares' : 'Popular Colors'}
						</small>
						<div className="d-flex flex-wrap gap-1">
							{quickColors.map((color, index) => (
								<button
									key={index}
									type="button"
									className="btn p-0 border-0"
									style={{
										width: '24px',
										height: '24px',
										backgroundColor: color,
										borderRadius: '4px',
										border: value.toLowerCase() === color.toLowerCase() ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,0.1)',
										cursor: 'pointer',
										boxShadow: value.toLowerCase() === color.toLowerCase() ? '0 0 0 2px rgba(13,110,253,0.25)' : 'none'
									}}
									onClick={() => onChange(color)}
									title={color.toUpperCase()}
								/>
							))}
						</div>
					</div>

					{/* Cores sugeridas para o tipo */}
					{colorType && (
						<div className="mb-3">
							<small className="text-muted fw-medium d-block mb-2">
								{locale === 'pt' ? 'Sugestões para este campo' : 'Suggestions for this field'}
							</small>
							<div className="d-flex flex-wrap gap-1">
								{suggestedColors.map((color, index) => (
									<button
										key={index}
										type="button"
										className="btn p-0 border-0"
										style={{
											width: '32px',
											height: '32px',
											backgroundColor: color,
											borderRadius: '6px',
											border: value.toLowerCase() === color.toLowerCase() ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,0.1)',
											cursor: 'pointer',
											boxShadow: value.toLowerCase() === color.toLowerCase() ? '0 0 0 2px rgba(13,110,253,0.25)' : 'none'
										}}
										onClick={() => onChange(color)}
										title={color.toUpperCase()}
									/>
								))}
							</div>
						</div>
					)}

					{/* Paletas harmônicas */}
					<div>
						<small className="text-muted fw-medium d-block mb-2">
							{locale === 'pt' ? 'Paletas Harmônicas' : 'Harmonic Palettes'}
						</small>
						<div className="d-flex flex-column gap-2">
							{harmonicPalettes.slice(0, 3).map((palette: ColorPalette, pIndex: number) => (
								<div key={pIndex}>
									<small className="text-muted" style={{ fontSize: '11px' }}>
										{locale === 'pt' ? palette.name : palette.nameEn}
									</small>
									<div className="d-flex gap-1 mt-1">
										{palette.colors.map((color: string, cIndex: number) => (
											<button
												key={cIndex}
												type="button"
												className="btn p-0 border-0"
												style={{
													width: '28px',
													height: '28px',
													backgroundColor: color,
													borderRadius: '4px',
													border: value.toLowerCase() === color.toLowerCase() ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,0.1)',
													cursor: 'pointer',
													boxShadow: value.toLowerCase() === color.toLowerCase() ? '0 0 0 2px rgba(13,110,253,0.25)' : 'none'
												}}
												onClick={() => onChange(color)}
												title={color.toUpperCase()}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{helpText && <small className="text-muted d-block mt-1">{helpText}</small>}
		</div>
	)
}
