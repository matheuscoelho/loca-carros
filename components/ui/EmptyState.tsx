'use client'

import Link from 'next/link'

type EmptyStateVariant =
	| 'no-bookings'
	| 'no-favorites'
	| 'no-notifications'
	| 'no-results'
	| 'no-vehicles'
	| 'no-reviews'
	| 'error'
	| 'coming-soon'

interface EmptyStateProps {
	variant?: EmptyStateVariant
	title?: string
	description?: string
	actionLabel?: string
	actionHref?: string
	onAction?: () => void
	size?: 'sm' | 'md' | 'lg'
}

const illustrations: Record<EmptyStateVariant, JSX.Element> = {
	'no-bookings': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#f0f4ff" />
			<rect x="35" y="30" width="50" height="60" rx="4" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
			<path d="M45 45H75" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
			<path d="M45 55H65" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
			<path d="M45 65H55" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
			<circle cx="85" cy="80" r="15" fill="#fff" stroke="#6366f1" strokeWidth="2" />
			<path d="M80 80L85 85L92 75" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	'no-favorites': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#fef2f2" />
			<path
				d="M60 90L52.5 83.1c-18.75-17.1-31.25-28.35-31.25-42C21.25 28.65 31.35 18 44.38 18c7.35 0 14.4 3.45 15.62 8.25C61.22 21.45 68.27 18 75.62 18c13.03 0 23.13 10.65 23.13 23.1 0 13.65-12.5 24.9-31.25 42L60 90z"
				fill="#fee2e2"
				stroke="#ef4444"
				strokeWidth="2"
			/>
			<line x1="40" y1="50" x2="80" y2="50" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
		</svg>
	),
	'no-notifications': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#fefce8" />
			<path
				d="M60 25C48.95 25 40 33.95 40 45v20l-5 10h50l-5-10V45c0-11.05-8.95-20-20-20z"
				fill="#fef9c3"
				stroke="#eab308"
				strokeWidth="2"
			/>
			<path d="M50 80c0 5.52 4.48 10 10 10s10-4.48 10-10" stroke="#eab308" strokeWidth="2" />
			<circle cx="75" cy="35" r="8" fill="#fff" stroke="#22c55e" strokeWidth="2" />
			<path d="M72 35l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	'no-results': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#f0fdf4" />
			<circle cx="50" cy="50" r="25" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
			<line x1="68" y1="68" x2="90" y2="90" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
			<path d="M40 50h20M50 40v20" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
		</svg>
	),
	'no-vehicles': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#f0f9ff" />
			<path
				d="M85 70H95c2 0 3-1 3-3v-10c0-3-2-5-5-6-3-1-15-4-15-4s-4-5-7-8c-2-2-4-3-6-3H35c-2 0-4 1-5 3l-5 9c-2 2-3 4-3 6v10c0 2 1 3 3 3h5"
				fill="#e0f2fe"
				stroke="#0ea5e9"
				strokeWidth="2"
			/>
			<circle cx="40" cy="70" r="8" fill="#fff" stroke="#0ea5e9" strokeWidth="2" />
			<circle cx="80" cy="70" r="8" fill="#fff" stroke="#0ea5e9" strokeWidth="2" />
			<line x1="30" y1="85" x2="90" y2="85" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
		</svg>
	),
	'no-reviews': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#fffbeb" />
			<path
				d="M60 25l8.5 17.2 19 2.8-13.75 13.4 3.25 18.9L60 68.3l-17 9L46.25 58.4 32.5 45l19-2.8L60 25z"
				fill="#fef3c7"
				stroke="#f59e0b"
				strokeWidth="2"
			/>
			<path d="M45 55h30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
		</svg>
	),
	'error': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#fef2f2" />
			<circle cx="60" cy="60" r="30" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
			<path d="M60 45v20" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
			<circle cx="60" cy="75" r="3" fill="#ef4444" />
		</svg>
	),
	'coming-soon': (
		<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="50" fill="#f5f3ff" />
			<rect x="35" y="35" width="50" height="50" rx="8" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
			<circle cx="60" cy="60" r="15" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
			<path d="M60 50v12l8 4" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
}

const defaultContent: Record<EmptyStateVariant, { title: string; description: string }> = {
	'no-bookings': {
		title: 'No bookings yet',
		description: 'Start exploring our vehicles and book your next adventure.',
	},
	'no-favorites': {
		title: 'No favorites yet',
		description: 'Save your favorite vehicles to quickly find them later.',
	},
	'no-notifications': {
		title: 'All caught up!',
		description: 'You have no new notifications at this time.',
	},
	'no-results': {
		title: 'No results found',
		description: 'Try adjusting your search or filter criteria.',
	},
	'no-vehicles': {
		title: 'No vehicles available',
		description: 'Check back soon for new additions to our fleet.',
	},
	'no-reviews': {
		title: 'No reviews yet',
		description: 'Be the first to leave a review!',
	},
	'error': {
		title: 'Something went wrong',
		description: 'We encountered an error. Please try again later.',
	},
	'coming-soon': {
		title: 'Coming soon',
		description: 'This feature is under development. Stay tuned!',
	},
}

export default function EmptyState({
	variant = 'no-results',
	title,
	description,
	actionLabel,
	actionHref,
	onAction,
	size = 'md'
}: EmptyStateProps) {
	const content = defaultContent[variant]
	const illustration = illustrations[variant]

	const sizes = {
		sm: { illustration: 'scale-75', title: 'h6', spacing: 'py-4' },
		md: { illustration: 'scale-100', title: 'h5', spacing: 'py-5' },
		lg: { illustration: 'scale-125', title: 'h4', spacing: 'py-6' },
	}

	return (
		<div className={`text-center ${sizes[size].spacing} animate-fade-in`}>
			<div className={`d-inline-block mb-4 ${sizes[size].illustration}`}>
				{illustration}
			</div>
			<h5 className={`${sizes[size].title} mb-2`}>
				{title || content.title}
			</h5>
			<p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
				{description || content.description}
			</p>
			{(actionLabel && (actionHref || onAction)) && (
				<div className="mt-3">
					{actionHref ? (
						<Link href={actionHref} className="btn btn-primary btn-press">
							{actionLabel}
						</Link>
					) : (
						<button onClick={onAction} className="btn btn-primary btn-press">
							{actionLabel}
						</button>
					)}
				</div>
			)}
		</div>
	)
}
