'use client'

import { useRef } from 'react'

interface ColorPickerProps {
	label: string
	value: string
	onChange: (value: string) => void
	helpText?: string
}

export default function ColorPicker({ label, value, onChange, helpText }: ColorPickerProps) {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleClick = () => {
		inputRef.current?.click()
	}

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
			{helpText && <small className="text-muted d-block mt-1">{helpText}</small>}
		</div>
	)
}
