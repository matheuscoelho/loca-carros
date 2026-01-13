'use client'

import { useTranslations } from 'next-intl'

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

interface TimelineStep {
	status: BookingStatus
	label: string
	date?: string
	time?: string
	isActive: boolean
	isCompleted: boolean
	icon: React.ReactNode
}

interface BookingTimelineProps {
	currentStatus: BookingStatus
	bookingDate?: string
	confirmationDate?: string
	pickupDate?: string
	returnDate?: string
	cancelledDate?: string
	variant?: 'horizontal' | 'vertical'
}

const statusOrder: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed']

const statusIcons: Record<BookingStatus, React.ReactNode> = {
	pending: (
		<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12,6 12,12 16,14" />
		</svg>
	),
	confirmed: (
		<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
			<polyline points="22,4 12,14.01 9,11.01" />
		</svg>
	),
	in_progress: (
		<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
			<circle cx="7" cy="17" r="2" />
			<circle cx="17" cy="17" r="2" />
		</svg>
	),
	completed: (
		<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
			<path d="M9 12l2 2 4-4" />
		</svg>
	),
	cancelled: (
		<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	)
}

const statusColors: Record<BookingStatus, { bg: string; text: string; border: string }> = {
	pending: { bg: '#fef3c7', text: '#d97706', border: '#fbbf24' },
	confirmed: { bg: '#dbeafe', text: '#2563eb', border: '#60a5fa' },
	in_progress: { bg: '#e0e7ff', text: '#4f46e5', border: '#818cf8' },
	completed: { bg: '#dcfce7', text: '#16a34a', border: '#4ade80' },
	cancelled: { bg: '#fee2e2', text: '#dc2626', border: '#f87171' }
}

export default function BookingTimeline({
	currentStatus,
	bookingDate,
	confirmationDate,
	pickupDate,
	returnDate,
	cancelledDate,
	variant = 'horizontal'
}: BookingTimelineProps) {
	const t = useTranslations('booking')

	const formatDate = (dateString?: string) => {
		if (!dateString) return null
		const date = new Date(dateString)
		return {
			date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
			time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
		}
	}

	const getStepDate = (status: BookingStatus) => {
		switch (status) {
			case 'pending':
				return formatDate(bookingDate)
			case 'confirmed':
				return formatDate(confirmationDate)
			case 'in_progress':
				return formatDate(pickupDate)
			case 'completed':
				return formatDate(returnDate)
			case 'cancelled':
				return formatDate(cancelledDate)
			default:
				return null
		}
	}

	const isCancelled = currentStatus === 'cancelled'
	const currentIndex = statusOrder.indexOf(currentStatus)

	const steps: TimelineStep[] = isCancelled
		? [
			{
				status: 'pending',
				label: t('timeline.booked'),
				...getStepDate('pending'),
				isActive: false,
				isCompleted: true,
				icon: statusIcons.pending
			},
			{
				status: 'cancelled',
				label: t('timeline.cancelled'),
				...getStepDate('cancelled'),
				isActive: true,
				isCompleted: false,
				icon: statusIcons.cancelled
			}
		]
		: statusOrder.map((status, index) => ({
			status,
			label: t(`timeline.${status}`),
			...getStepDate(status),
			isActive: index === currentIndex,
			isCompleted: index < currentIndex,
			icon: statusIcons[status]
		}))

	if (variant === 'vertical') {
		return (
			<div className="booking-timeline-vertical">
				{steps.map((step, index) => {
					const colors = statusColors[step.status]
					const isLast = index === steps.length - 1

					return (
						<div key={step.status} className="d-flex">
							{/* Line and circle */}
							<div className="d-flex flex-column align-items-center" style={{ width: '40px' }}>
								<div
									style={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: step.isCompleted || step.isActive ? colors.bg : '#f1f5f9',
										color: step.isCompleted || step.isActive ? colors.text : '#94a3b8',
										border: `2px solid ${step.isCompleted || step.isActive ? colors.border : '#e2e8f0'}`,
										transition: 'all 0.3s ease'
									}}
								>
									{step.icon}
								</div>
								{!isLast && (
									<div
										style={{
											width: '2px',
											height: '40px',
											background: step.isCompleted ? colors.border : '#e2e8f0',
											transition: 'background 0.3s ease'
										}}
									/>
								)}
							</div>
							{/* Content */}
							<div className="ms-3 pb-4">
								<h6
									className="mb-1"
									style={{
										color: step.isActive ? colors.text : step.isCompleted ? '#1e293b' : '#64748b',
										fontWeight: step.isActive ? 600 : 500
									}}
								>
									{step.label}
								</h6>
								{step.date && (
									<p className="text-muted mb-0 small">
										{step.date} {step.time && `às ${step.time}`}
									</p>
								)}
								{step.isActive && !isCancelled && (
									<span
										className="badge mt-2"
										style={{
											background: colors.bg,
											color: colors.text,
											padding: '4px 10px',
											borderRadius: '12px',
											fontSize: '11px'
										}}
									>
										Status atual
									</span>
								)}
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	// Horizontal variant (default)
	return (
		<div className="booking-timeline-horizontal">
			<div className="d-flex justify-content-between position-relative">
				{/* Progress line */}
				<div
					className="position-absolute"
					style={{
						top: '20px',
						left: '40px',
						right: '40px',
						height: '2px',
						background: '#e2e8f0',
						zIndex: 0
					}}
				>
					<div
						style={{
							height: '100%',
							width: isCancelled ? '0%' : `${(currentIndex / (steps.length - 1)) * 100}%`,
							background: statusColors[currentStatus].border,
							transition: 'width 0.5s ease'
						}}
					/>
				</div>

				{/* Steps */}
				{steps.map((step, index) => {
					const colors = statusColors[step.status]

					return (
						<div
							key={step.status}
							className="d-flex flex-column align-items-center text-center position-relative"
							style={{ zIndex: 1, flex: 1 }}
						>
							{/* Circle */}
							<div
								style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: step.isCompleted || step.isActive ? colors.bg : 'white',
									color: step.isCompleted || step.isActive ? colors.text : '#94a3b8',
									border: `2px solid ${step.isCompleted || step.isActive ? colors.border : '#e2e8f0'}`,
									transition: 'all 0.3s ease',
									boxShadow: step.isActive ? `0 0 0 4px ${colors.bg}` : 'none'
								}}
							>
								{step.icon}
							</div>

							{/* Label */}
							<div className="mt-3">
								<p
									className="mb-1 small fw-medium"
									style={{
										color: step.isActive ? colors.text : step.isCompleted ? '#1e293b' : '#94a3b8'
									}}
								>
									{step.label}
								</p>
								{step.date && (
									<p className="text-muted mb-0" style={{ fontSize: '11px' }}>
										{step.date}
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
