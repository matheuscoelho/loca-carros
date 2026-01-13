'use client'

interface LineChartProps {
	data: Array<{
		label: string
		value: number
	}>
	height?: number
	lineColor?: string
	fillColor?: string
	showDots?: boolean
	showArea?: boolean
	title?: string
	valuePrefix?: string
}

export default function LineChart({
	data,
	height = 200,
	lineColor = '#6366f1',
	fillColor = '#6366f115',
	showDots = true,
	showArea = true,
	title,
	valuePrefix = ''
}: LineChartProps) {
	if (data.length === 0) return null

	const maxValue = Math.max(...data.map(d => d.value), 1)
	const minValue = Math.min(...data.map(d => d.value))
	const padding = 40
	const chartWidth = 100
	const chartHeight = height - padding * 2

	// Calculate points
	const points = data.map((item, index) => {
		const x = (index / (data.length - 1 || 1)) * 100
		const y = maxValue > 0 ? ((maxValue - item.value) / maxValue) * chartHeight + padding : padding
		return { x, y, ...item }
	})

	// Create SVG path
	const linePath = points
		.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
		.join(' ')

	// Create area path
	const areaPath = `${linePath} L ${100} ${height - padding} L 0 ${height - padding} Z`

	return (
		<div className="line-chart">
			{title && <h6 className="mb-3">{title}</h6>}
			<div className="position-relative" style={{ height: `${height}px` }}>
				<svg
					width="100%"
					height="100%"
					viewBox={`0 0 100 ${height}`}
					preserveAspectRatio="none"
				>
					{/* Grid lines */}
					{[0, 25, 50, 75, 100].map((percent) => {
						const y = padding + (chartHeight * percent) / 100
						return (
							<line
								key={percent}
								x1="0"
								y1={y}
								x2="100"
								y2={y}
								stroke="#e2e8f0"
								strokeWidth="0.5"
								strokeDasharray="2,2"
								vectorEffect="non-scaling-stroke"
							/>
						)
					})}

					{/* Area fill */}
					{showArea && (
						<path
							d={areaPath}
							fill={fillColor}
							style={{ transition: 'd 0.5s ease' }}
						/>
					)}

					{/* Line */}
					<path
						d={linePath}
						fill="none"
						stroke={lineColor}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						vectorEffect="non-scaling-stroke"
						style={{ transition: 'd 0.5s ease' }}
					/>

					{/* Dots */}
					{showDots &&
						points.map((point, index) => (
							<g key={index}>
								<circle
									cx={point.x}
									cy={point.y}
									r="4"
									fill="white"
									stroke={lineColor}
									strokeWidth="2"
									vectorEffect="non-scaling-stroke"
								/>
							</g>
						))}
				</svg>

				{/* Y-axis labels */}
				<div
					className="position-absolute h-100 d-flex flex-column justify-content-between"
					style={{ left: '-35px', top: `${padding}px`, height: `${chartHeight}px` }}
				>
					<span className="text-muted" style={{ fontSize: '10px' }}>
						{valuePrefix}{maxValue.toLocaleString()}
					</span>
					<span className="text-muted" style={{ fontSize: '10px' }}>
						{valuePrefix}{Math.round(maxValue / 2).toLocaleString()}
					</span>
					<span className="text-muted" style={{ fontSize: '10px' }}>
						{valuePrefix}0
					</span>
				</div>

				{/* X-axis labels */}
				<div
					className="position-absolute w-100 d-flex justify-content-between"
					style={{ bottom: '5px', paddingLeft: '0', paddingRight: '0' }}
				>
					{data.map((item, index) => (
						<span
							key={index}
							className="text-muted text-center"
							style={{
								fontSize: '10px',
								width: `${100 / data.length}%`
							}}
						>
							{item.label}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
