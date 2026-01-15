'use client'

interface SocialMedia {
	instagram?: string
	facebook?: string
	twitter?: string
	youtube?: string
	linkedin?: string
	whatsapp?: string
}

interface FooterPreviewProps {
	logo: string
	siteName: string
	logoWidth: number
	logoHeight: number
	primaryColor: string
	contactEmail?: string
	contactPhone?: string
	socialMedia?: SocialMedia
}

export default function FooterPreview({
	logo,
	siteName,
	logoWidth,
	logoHeight,
	primaryColor,
	contactEmail,
	contactPhone,
	socialMedia = {}
}: FooterPreviewProps) {
	const hasSocialMedia = Object.values(socialMedia).some(v => v)

	// Contagem de redes sociais ativas
	const socialCount = Object.values(socialMedia).filter(v => v).length

	return (
		<div className="position-relative">
			{/* Badge de Preview */}
			<div
				className="position-absolute top-0 end-0 px-2 py-1 rounded-bottom-start"
				style={{
					backgroundColor: '#8b5cf6',
					color: '#fff',
					fontSize: '9px',
					fontWeight: 600,
					zIndex: 10,
					letterSpacing: '0.5px'
				}}
			>
				FOOTER
			</div>

			<div
				className="border rounded overflow-hidden"
				style={{
					background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
					fontSize: '9px',
					color: '#94a3b8',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
				}}
			>
				{/* Newsletter section */}
				<div
					className="d-flex justify-content-between align-items-center px-3 py-2"
					style={{
						background: `linear-gradient(90deg, ${primaryColor}20 0%, transparent 100%)`,
						borderBottom: '1px solid rgba(255,255,255,0.1)'
					}}
				>
					<div className="d-flex align-items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill={primaryColor} viewBox="0 0 16 16">
							<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Z"/>
						</svg>
						<span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '10px' }}>Inscreva-se na newsletter</span>
					</div>
					<div className="d-flex gap-1">
						<div
							style={{
								width: '70px',
								height: '22px',
								backgroundColor: 'rgba(255,255,255,0.1)',
								borderRadius: '4px',
								border: '1px solid rgba(255,255,255,0.1)'
							}}
						/>
						<div
							style={{
								width: '32px',
								height: '22px',
								backgroundColor: primaryColor,
								borderRadius: '4px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#fff',
								fontSize: '8px',
								fontWeight: 600
							}}
						>
							OK
						</div>
					</div>
				</div>

				{/* Main footer */}
				<div className="px-3 py-3">
					<div className="row g-2">
						{/* Logo e contato */}
						<div className="col-4">
							<img
								src={logo}
								alt={siteName}
								style={{
									width: Math.min(logoWidth * 0.35, 55),
									height: Math.min(logoHeight * 0.35, 18),
									objectFit: 'contain',
									marginBottom: '8px',
									filter: 'brightness(1.1)'
								}}
								onError={(e) => {
									e.currentTarget.style.display = 'none'
								}}
							/>
							{contactEmail && (
								<div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '8px', color: '#94a3b8' }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill={primaryColor} viewBox="0 0 16 16">
										<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"/>
									</svg>
									<span style={{ color: '#cbd5e1' }}>{contactEmail}</span>
								</div>
							)}
							{contactPhone && (
								<div className="d-flex align-items-center gap-1" style={{ fontSize: '8px', color: '#94a3b8' }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill={primaryColor} viewBox="0 0 16 16">
										<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608z"/>
									</svg>
									<span style={{ color: '#cbd5e1' }}>{contactPhone}</span>
								</div>
							)}
						</div>

						{/* Colunas de links */}
						<div className="col-2">
							<div style={{ color: primaryColor, fontWeight: 600, marginBottom: '6px', fontSize: '9px' }}>Empresa</div>
							<div className="d-flex flex-column gap-1" style={{ color: '#94a3b8', fontSize: '8px' }}>
								<span>Sobre nós</span>
								<span>Termos</span>
								<span>Privacidade</span>
							</div>
						</div>
						<div className="col-2">
							<div style={{ color: primaryColor, fontWeight: 600, marginBottom: '6px', fontSize: '9px' }}>Serviços</div>
							<div className="d-flex flex-column gap-1" style={{ color: '#94a3b8', fontSize: '8px' }}>
								<span>Aluguel</span>
								<span>Locação</span>
								<span>Luxo</span>
							</div>
						</div>
						<div className="col-2">
							<div style={{ color: primaryColor, fontWeight: 600, marginBottom: '6px', fontSize: '9px' }}>Suporte</div>
							<div className="d-flex flex-column gap-1" style={{ color: '#94a3b8', fontSize: '8px' }}>
								<span>FAQ</span>
								<span>Chat</span>
								<span>Ajuda</span>
							</div>
						</div>
						<div className="col-2">
							<div style={{ color: primaryColor, fontWeight: 600, marginBottom: '6px', fontSize: '9px' }}>Links</div>
							<div className="d-flex flex-column gap-1" style={{ color: '#94a3b8', fontSize: '8px' }}>
								<span>Home</span>
								<span>Veículos</span>
								<span>Contato</span>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom footer */}
				<div
					className="d-flex justify-content-between align-items-center px-3 py-2"
					style={{
						backgroundColor: 'rgba(0,0,0,0.3)',
						borderTop: '1px solid rgba(255,255,255,0.1)'
					}}
				>
					<span style={{ fontSize: '8px', color: '#64748b' }}>© 2024 {siteName}</span>
					{hasSocialMedia && (
						<div className="d-flex gap-1 align-items-center">
							<span style={{ fontSize: '7px', color: '#64748b', marginRight: '4px' }}>
								{socialCount} redes
							</span>
							{socialMedia.instagram && (
								<div style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									background: `linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="#fff" viewBox="0 0 16 16">
										<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003z"/>
									</svg>
								</div>
							)}
							{socialMedia.facebook && (
								<div style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									backgroundColor: '#1877f2',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="#fff" viewBox="0 0 16 16">
										<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
									</svg>
								</div>
							)}
							{socialMedia.twitter && (
								<div style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									backgroundColor: '#000',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="#fff" viewBox="0 0 16 16">
										<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Z"/>
									</svg>
								</div>
							)}
							{socialMedia.youtube && (
								<div style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									backgroundColor: '#ff0000',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="#fff" viewBox="0 0 16 16">
										<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142z"/>
									</svg>
								</div>
							)}
							{socialMedia.linkedin && (
								<div style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									backgroundColor: '#0a66c2',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="#fff" viewBox="0 0 16 16">
										<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146z"/>
									</svg>
								</div>
							)}
							{socialMedia.whatsapp && (
								<div style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									backgroundColor: '#25d366',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="#fff" viewBox="0 0 16 16">
										<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/>
									</svg>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
