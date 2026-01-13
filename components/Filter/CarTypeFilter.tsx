'use client'

interface CarTypeFilterProps {
	selectedTypes: string[]
	onChange: (types: string[]) => void
	availableTypes?: string[]
}

const carTypeIcons: Record<string, { icon: React.ReactNode; label: string }> = {
	Sedan: {
		label: 'Sedan',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
			</svg>
		)
	},
	SUV: {
		label: 'SUV',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M5 17h-2c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h1.5l1.5-3c.3-.6.9-1 1.5-1h7c.6 0 1.2.4 1.5 1l1.5 3H19c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-2" />
				<path d="M5 8v-2c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
			</svg>
		)
	},
	Hatchback: {
		label: 'Hatch',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M17 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-4l-2-4H6c-.6 0-1.1.4-1.4.9L3 12c-.3.5-.5 1.1-.5 1.7V16c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
			</svg>
		)
	},
	Coupe: {
		label: 'Coupé',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M17 17h3c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1l-3-1-3-4H8l-3 3c-.6.6-1 1.4-1 2.2V16c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
			</svg>
		)
	},
	Pickup: {
		label: 'Pickup',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M14 17h6c.6 0 1-.4 1-1v-3l-3-3h-4v7z" />
				<path d="M14 10V6H4c-.6 0-1 .4-1 1v9c0 .6.4 1 1 1h1" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
			</svg>
		)
	},
	Van: {
		label: 'Van',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M17 17h3c.6 0 1-.4 1-1V9c0-.6-.4-1-1-1h-3l-2-3H5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
				<line x1="12" y1="5" x2="12" y2="11" />
			</svg>
		)
	},
	Convertible: {
		label: 'Conversível',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M17 17h3c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1h-3l-2-3H7l-2 2c-.6.6-1 1.4-1 2.2V16c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
				<path d="M7 10c2-1 4-1 6 0" />
			</svg>
		)
	},
	Luxury: {
		label: 'Luxo',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
				<path d="M12 2l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3L8 5h3l1-3z" />
			</svg>
		)
	},
	Sports: {
		label: 'Esportivo',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M18 17h3c.6 0 1-.4 1-1v-2c0-.8-.5-1.5-1.2-1.8L17 11l-3-4H8L5 10l-2.8 1.2C1.5 11.5 1 12.2 1 13v3c0 .6.4 1 1 1h3" />
				<circle cx="6" cy="17" r="2" />
				<circle cx="18" cy="17" r="2" />
			</svg>
		)
	},
	Electric: {
		label: 'Elétrico',
		icon: (
			<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
				<circle cx="7" cy="17" r="2" />
				<circle cx="17" cy="17" r="2" />
				<path d="M13 6l-2 4h3l-2 4" />
			</svg>
		)
	}
}

const defaultTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Pickup', 'Van', 'Convertible', 'Luxury', 'Sports', 'Electric']

export default function CarTypeFilter({
	selectedTypes,
	onChange,
	availableTypes
}: CarTypeFilterProps) {
	const types = availableTypes || defaultTypes

	const handleToggle = (type: string) => {
		if (selectedTypes.includes(type)) {
			onChange(selectedTypes.filter(t => t !== type))
		} else {
			onChange([...selectedTypes, type])
		}
	}

	return (
		<div className="car-type-filter">
			<div className="d-flex flex-wrap gap-2">
				{types.map((type) => {
					const config = carTypeIcons[type] || {
						label: type,
						icon: carTypeIcons.Sedan.icon
					}
					const isSelected = selectedTypes.includes(type)

					return (
						<button
							key={type}
							onClick={() => handleToggle(type)}
							className="btn"
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '12px 16px',
								minWidth: '85px',
								borderRadius: '12px',
								border: isSelected ? '2px solid #6366f1' : '2px solid #e2e8f0',
								background: isSelected ? '#eef2ff' : 'white',
								color: isSelected ? '#4f46e5' : '#64748b',
								transition: 'all 0.2s ease',
								gap: '6px'
							}}
						>
							{config.icon}
							<span style={{ fontSize: '12px', fontWeight: 500 }}>
								{config.label}
							</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
