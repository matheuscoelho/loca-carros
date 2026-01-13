'use client'

interface BarChartProps {
	data: Array<{
		label: string
		value: number
		color?: string
	}>
	height?: number
	barColor?: string
	showValues?: boolean
	title?: string
}

export default function BarChart({
	data,
	height = 200,
	barColor = '#6366f1',
	showValues = true,
	title
}: BarChartProps) {
	const maxValue = Math.max(...data.map(d => d.value), 1)
	const barWidth = 100 / data.length
	const barPadding = 20 // percentage padding between bars

	return (
		<div className="bar-chart">
			{title && <h6 className="mb-3">{title}</h6>}
			<div className="position-relative" style={{ height: `${height}px` }}>
				{/* Y-axis lines */}
				<div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
					{[0, 25, 50, 75, 100].map((percent) => (
						<div
							key={percent}
							className="position-absolute w-100 d-flex align-items-center"
							style={{
								bottom: `${percent}%`,
								borderTop: '1px dashed #e2e8f0'
							}}
						>
							<span
								className="position-absolute text-muted"
								style={{
									left: '-30px',
									fontSize: '10px'
								}}
							>
								{Math.round((maxValue * percent) / 100)}
							</span>
						</div>
					))}
				</div>

				{/* Bars */}
				<div
					className="d-flex align-items-end justify-content-around h-100 position-relative"
					style={{ zIndex: 1, paddingLeft: '30px' }}
				>
					{data.map((item, index) => {
						const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0
						const color = item.color || barColor

						return (
							<div
								key={index}
								className="d-flex flex-column align-items-center"
								style={{ width: `${barWidth}%` }}
							>
								{/* Value label */}
								{showValues && (
									<span
										className="text-center fw-medium mb-1"
										style={{ fontSize: '11px', color }}
									>
										{item.value}
									</span>
								)}
								{/* Bar */}
								<div
									style={{
										width: '60%',
										maxWidth: '50px',
										height: `${barHeight}%`,
										background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
										borderRadius: '6px 6px 0 0',
										transition: 'height 0.5s ease',
										minHeight: item.value > 0 ? '4px' : '0'
									}}
								/>
								{/* Label */}
								<span
									className="text-center text-muted mt-2"
									style={{
										fontSize: '11px',
										width: '100%',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									{item.label}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
