'use client'

interface FuelTypeFilterProps {
	selectedTypes: string[]
	onChange: (types: string[]) => void
	availableTypes?: string[]
}

const fuelTypeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
	Gasoline: {
		label: 'Gasolina',
		color: '#ef4444',
		icon: (
			<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M3 22V8a2 2 0 012-2h6a2 2 0 012 2v14" />
				<path d="M3 22h10" />
				<path d="M13 10h2a2 2 0 012 2v3a2 2 0 002 2h0a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
				<path d="M18 7V4" />
				<path d="M17 4h2" />
				<rect x="6" y="10" width="4" height="4" rx="1" />
			</svg>
		)
	},
	Diesel: {
		label: 'Diesel',
		color: '#f59e0b',
		icon: (
			<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M3 22V8a2 2 0 012-2h6a2 2 0 012 2v14" />
				<path d="M3 22h10" />
				<path d="M13 10h2a2 2 0 012 2v3a2 2 0 002 2h0a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
				<path d="M18 7V4" />
				<path d="M17 4h2" />
				<circle cx="8" cy="12" r="2" />
			</svg>
		)
	},
	Electric: {
		label: 'Elétrico',
		color: '#10b981',
		icon: (
			<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
			</svg>
		)
	},
	Hybrid: {
		label: 'Híbrido',
		color: '#3b82f6',
		icon: (
			<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 6v6l4 2" />
				<path d="M8 16l4-4" />
			</svg>
		)
	},
	Flex: {
		label: 'Flex',
		color: '#8b5cf6',
		icon: (
			<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M3 22V8a2 2 0 012-2h6a2 2 0 012 2v14" />
				<path d="M3 22h10" />
				<path d="M7 10h2" />
				<path d="M7 14h2" />
				<path d="M17 6l2 2-2 2" />
				<path d="M21 6l-2 2 2 2" />
				<path d="M19 14v6" />
			</svg>
		)
	},
	Natural_Gas: {
		label: 'GNV',
		color: '#06b6d4',
		icon: (
			<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M12 3c-4.97 0-9 3.13-9 7 0 3 2.5 5.5 6 6.5V22h6v-5.5c3.5-1 6-3.5 6-6.5 0-3.87-4.03-7-9-7z" />
				<path d="M12 3v7" />
			</svg>
		)
	}
}

const defaultTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Flex']

export default function FuelTypeFilter({
	selectedTypes,
	onChange,
	availableTypes
}: FuelTypeFilterProps) {
	const types = availableTypes || defaultTypes

	const handleToggle = (type: string) => {
		if (selectedTypes.includes(type)) {
			onChange(selectedTypes.filter(t => t !== type))
		} else {
			onChange([...selectedTypes, type])
		}
	}

	return (
		<div className="fuel-type-filter">
			<div className="d-flex flex-wrap gap-2">
				{types.map((type) => {
					const config = fuelTypeConfig[type] || {
						label: type,
						color: '#64748b',
						icon: fuelTypeConfig.Gasoline.icon
					}
					const isSelected = selectedTypes.includes(type)

					return (
						<button
							key={type}
							onClick={() => handleToggle(type)}
							className="btn d-flex align-items-center gap-2"
							style={{
								padding: '10px 16px',
								borderRadius: '25px',
								border: isSelected ? `2px solid ${config.color}` : '2px solid #e2e8f0',
								background: isSelected ? `${config.color}15` : 'white',
								color: isSelected ? config.color : '#64748b',
								transition: 'all 0.2s ease',
								fontSize: '13px',
								fontWeight: 500
							}}
						>
							<span style={{ color: isSelected ? config.color : '#94a3b8' }}>
								{config.icon}
							</span>
							{config.label}
						</button>
					)
				})}
			</div>
		</div>
	)
}
