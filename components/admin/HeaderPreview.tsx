'use client'

interface HeaderPreviewProps {
	logo: string
	siteName: string
	logoWidth: number
	logoHeight: number
	primaryColor: string
	secondaryColor?: string
	contactPhone?: string
	contactEmail?: string
	darkMode?: boolean
}

export default function HeaderPreview({
	logo,
	siteName,
	logoWidth,
	logoHeight,
	primaryColor,
	secondaryColor = '#64748b',
	contactPhone,
	contactEmail,
	darkMode = false
}: HeaderPreviewProps) {
	return (
		<div className="position-relative">
			{/* Badge de Preview */}
			<div
				className="position-absolute top-0 end-0 px-2 py-1 rounded-bottom-start"
				style={{
					backgroundColor: darkMode ? '#22d3ee' : '#3b82f6',
					color: '#fff',
					fontSize: '9px',
					fontWeight: 600,
					zIndex: 10,
					letterSpacing: '0.5px'
				}}
			>
				{darkMode ? 'DARK MODE' : 'LIGHT MODE'}
			</div>

			<div
				className="border rounded overflow-hidden"
				style={{
					backgroundColor: darkMode ? '#0f172a' : '#ffffff',
					fontSize: '10px',
					boxShadow: darkMode
						? '0 4px 12px rgba(0, 0, 0, 0.4)'
						: '0 4px 12px rgba(0, 0, 0, 0.1)',
					border: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0'
				}}
			>
				{/* Top bar */}
				<div
					className="d-flex justify-content-between align-items-center px-3 py-1"
					style={{
						backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
						borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
					}}
				>
					<div className="d-flex gap-3 align-items-center">
						{contactPhone && (
							<span className="d-flex align-items-center gap-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
								<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
									<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
								</svg>
								{contactPhone}
							</span>
						)}
						{contactEmail && (
							<span className="d-flex align-items-center gap-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
								<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
									<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Z"/>
								</svg>
								{contactEmail}
							</span>
						)}
					</div>
					<div className="d-flex gap-1 align-items-center">
						<span
							className="px-1 rounded"
							style={{
								color: '#fff',
								backgroundColor: secondaryColor,
								fontSize: '8px',
								fontWeight: 500
							}}
						>
							PT
						</span>
						<span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>|</span>
						<span style={{ color: darkMode ? '#64748b' : '#94a3b8', fontSize: '9px' }}>EN</span>
					</div>
				</div>

				{/* Main header */}
				<div
					className="d-flex justify-content-between align-items-center px-3 py-2"
					style={{
						background: darkMode
							? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
							: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
					}}
				>
					<div className="d-flex align-items-center gap-2">
						<img
							src={logo}
							alt={siteName}
							style={{
								width: Math.min(logoWidth * 0.5, 80),
								height: Math.min(logoHeight * 0.5, 28),
								objectFit: 'contain'
							}}
							onError={(e) => {
								e.currentTarget.style.display = 'none'
							}}
						/>
					</div>
					<div className="d-flex gap-3 align-items-center">
						<span
							style={{
								color: primaryColor,
								fontWeight: 600,
								fontSize: '10px',
								borderBottom: `2px solid ${primaryColor}`,
								paddingBottom: '2px'
							}}
						>
							Home
						</span>
						<span style={{ color: darkMode ? '#cbd5e1' : '#475569', fontSize: '10px' }}>Veículos</span>
						<span style={{ color: darkMode ? '#cbd5e1' : '#475569', fontSize: '10px' }}>Sobre</span>
						<span style={{ color: darkMode ? '#cbd5e1' : '#475569', fontSize: '10px' }}>Contato</span>
						<button
							className="btn btn-sm px-2 py-1"
							style={{
								backgroundColor: primaryColor,
								color: '#fff',
								fontSize: '9px',
								borderRadius: '6px',
								fontWeight: 600,
								boxShadow: `0 2px 8px ${primaryColor}40`,
								border: 'none'
							}}
						>
							Reservar
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
