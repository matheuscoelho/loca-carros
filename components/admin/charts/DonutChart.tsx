'use client'

interface DonutChartProps {
	data: Array<{
		label: string
		value: number
		color: string
	}>
	size?: number
	strokeWidth?: number
	showLegend?: boolean
	title?: string
}

export default function DonutChart({
	data,
	size = 200,
	strokeWidth = 30,
	showLegend = true,
	title
}: DonutChartProps) {
	const total = data.reduce((sum, item) => sum + item.value, 0)
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const center = size / 2

	let accumulatedOffset = 0

	const segments = data.map((item, index) => {
		const percentage = total > 0 ? item.value / total : 0
		const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`
		const strokeDashoffset = -accumulatedOffset
		accumulatedOffset += circumference * percentage

		return {
			...item,
			percentage,
			strokeDasharray,
			strokeDashoffset
		}
	})

	return (
		<div className="donut-chart">
			{title && <h6 className="mb-3">{title}</h6>}
			<div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
				<div className="position-relative" style={{ width: size, height: size }}>
					<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
						{/* Background circle */}
						<circle
							cx={center}
							cy={center}
							r={radius}
							fill="none"
							stroke="#e2e8f0"
							strokeWidth={strokeWidth}
						/>
						{/* Data segments */}
						{segments.map((segment, index) => (
							<circle
								key={index}
								cx={center}
								cy={center}
								r={radius}
								fill="none"
								stroke={segment.color}
								strokeWidth={strokeWidth}
								strokeDasharray={segment.strokeDasharray}
								strokeDashoffset={segment.strokeDashoffset}
								strokeLinecap="round"
								style={{
									transform: 'rotate(-90deg)',
									transformOrigin: 'center',
									transition: 'stroke-dasharray 0.5s ease'
								}}
							/>
						))}
					</svg>
					{/* Center text */}
					<div
						className="position-absolute d-flex flex-column align-items-center justify-content-center"
						style={{
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)'
						}}
					>
						<span className="h4 mb-0 fw-bold">{total}</span>
						<span className="text-muted small">Total</span>
					</div>
				</div>

				{/* Legend */}
				{showLegend && (
					<div className="donut-legend">
						{data.map((item, index) => (
							<div
								key={index}
								className="d-flex align-items-center gap-2 mb-2"
							>
								<div
									style={{
										width: '12px',
										height: '12px',
										borderRadius: '3px',
										background: item.color
									}}
								/>
								<span className="small text-muted">{item.label}</span>
								<span className="small fw-medium ms-auto">{item.value}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
