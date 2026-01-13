'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Review {
	_id: string
	rating: number
	ratings?: {
		price?: number
		service?: number
		safety?: number
		comfort?: number
		cleanliness?: number
	}
	title?: string
	comment: string
	status: string
	response?: {
		text: string
		respondedAt: string
	}
	helpful?: {
		count: number
	}
	createdAt: string
	user?: {
		name: string
		email: string
	}
	car?: {
		brand: string
		model: string
	}
}

export default function AdminReviewsPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [statusFilter, setStatusFilter] = useState('all')
	const [searchTerm, setSearchTerm] = useState('')
	const [stats, setStats] = useState<Record<string, number>>({})
	const [averageRating, setAverageRating] = useState(0)
	const [processing, setProcessing] = useState<string | null>(null)
	const [responseModal, setResponseModal] = useState<{ reviewId: string; show: boolean }>({ reviewId: '', show: false })
	const [responseText, setResponseText] = useState('')

	useEffect(() => {
		fetchReviews()
	}, [statusFilter])

	const fetchReviews = async () => {
		try {
			setLoading(true)
			const params = new URLSearchParams()
			if (statusFilter !== 'all') params.set('status', statusFilter)

			const response = await fetch(`/api/admin/reviews?${params}`)
			if (!response.ok) {
				throw new Error('Failed to fetch reviews')
			}
			const data = await response.json()
			setReviews(data.reviews || [])
			setStats(data.stats || {})
			setAverageRating(data.averageRating || 0)
		} catch (err) {
			setError('Error loading reviews')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleStatusChange = async (reviewId: string, newStatus: string) => {
		setProcessing(reviewId)
		try {
			const response = await fetch('/api/admin/reviews', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reviewId, status: newStatus })
			})

			if (response.ok) {
				setReviews(reviews.map(r =>
					r._id === reviewId ? { ...r, status: newStatus } : r
				))
			} else {
				alert('Failed to update review status')
			}
		} catch (err) {
			console.error('Error updating review:', err)
		} finally {
			setProcessing(null)
		}
	}

	const handleResponse = async () => {
		if (!responseText.trim()) return

		setProcessing(responseModal.reviewId)
		try {
			const response = await fetch('/api/admin/reviews', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					reviewId: responseModal.reviewId,
					response: responseText
				})
			})

			if (response.ok) {
				fetchReviews()
				setResponseModal({ reviewId: '', show: false })
				setResponseText('')
			} else {
				alert('Failed to add response')
			}
		} catch (err) {
			console.error('Error adding response:', err)
		} finally {
			setProcessing(null)
		}
	}

	const filteredReviews = reviews.filter(review => {
		const matchesSearch =
			(review.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(review.car?.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(review.car?.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.comment.toLowerCase().includes(searchTerm.toLowerCase())
		return matchesSearch
	})

	const getStatusBadge = (status: string) => {
		const badges: Record<string, string> = {
			pending: 'bg-warning',
			approved: 'bg-success',
			rejected: 'bg-danger',
		}
		return badges[status] || 'bg-secondary'
	}

	const renderStars = (rating: number) => {
		return (
			<span className="text-warning">
				{[1, 2, 3, 4, 5].map(star => (
					<span key={star}>
						{star <= rating ? '★' : '☆'}
					</span>
				))}
			</span>
		)
	}

	if (loading && reviews.length === 0) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">{tCommon('loading')}</span>
				</div>
			</div>
		)
	}

	return (
		<div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">{t('reviews.title')}</h1>
			</div>

			{/* Stats Cards */}
			<div className="row g-3 mb-4">
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-primary mb-0">{reviews.length}</h3>
							<small className="text-muted">Total Reviews</small>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-warning mb-0">{stats.pending || 0}</h3>
							<small className="text-muted">{t('reviews.pending')}</small>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-success mb-0">{stats.approved || 0}</h3>
							<small className="text-muted">Approved</small>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="mb-0">
								{renderStars(Math.round(averageRating))}
							</h3>
							<small className="text-muted">
								Average: {averageRating.toFixed(1)}/5
							</small>
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-body">
					<div className="row g-3">
						<div className="col-md-6">
							<input
								type="text"
								className="form-control"
								placeholder={`${tCommon('search')} by customer, vehicle, comment...`}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="col-md-3">
							<select
								className="form-select"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
							>
								<option value="all">All Status</option>
								<option value="pending">Pending</option>
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
							</select>
						</div>
						<div className="col-md-3 text-end">
							<span className="text-muted">
								{filteredReviews.length} reviews
							</span>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="alert alert-danger">{error}</div>
			)}

			{/* Reviews List */}
			<div className="row g-3">
				{filteredReviews.length > 0 ? (
					filteredReviews.map((review) => (
						<div key={review._id} className="col-12">
							<div className="card border-0 shadow-sm">
								<div className="card-body">
									<div className="d-flex justify-content-between align-items-start mb-3">
										<div>
											<div className="d-flex align-items-center gap-2 mb-2">
												{renderStars(review.rating)}
												<span className={`badge ${getStatusBadge(review.status)}`}>
													{review.status}
												</span>
											</div>
											<h6 className="mb-1">{review.title || 'No title'}</h6>
											<small className="text-muted">
												By <strong>{review.user?.name || 'Unknown'}</strong>
												{' - '}
												{review.car?.brand} {review.car?.model}
												{' - '}
												{new Date(review.createdAt).toLocaleDateString()}
											</small>
										</div>
										<div className="btn-group">
											{review.status === 'pending' && (
												<>
													<button
														className="btn btn-sm btn-success"
														onClick={() => handleStatusChange(review._id, 'approved')}
														disabled={processing === review._id}
													>
														{t('reviews.approve')}
													</button>
													<button
														className="btn btn-sm btn-danger"
														onClick={() => handleStatusChange(review._id, 'rejected')}
														disabled={processing === review._id}
													>
														{t('reviews.reject')}
													</button>
												</>
											)}
											<button
												className="btn btn-sm btn-outline-primary"
												onClick={() => setResponseModal({ reviewId: review._id, show: true })}
											>
												{t('reviews.respond')}
											</button>
										</div>
									</div>

									<p className="mb-2">{review.comment}</p>

									{review.ratings && (
										<div className="d-flex gap-3 flex-wrap text-muted small mb-2">
											{review.ratings.price && <span>Price: {review.ratings.price}/5</span>}
											{review.ratings.service && <span>Service: {review.ratings.service}/5</span>}
											{review.ratings.safety && <span>Safety: {review.ratings.safety}/5</span>}
											{review.ratings.comfort && <span>Comfort: {review.ratings.comfort}/5</span>}
											{review.ratings.cleanliness && <span>Cleanliness: {review.ratings.cleanliness}/5</span>}
										</div>
									)}

									{review.response && (
										<div className="bg-light p-3 rounded mt-3">
											<small className="text-muted">Response from Admin:</small>
											<p className="mb-0 mt-1">{review.response.text}</p>
										</div>
									)}

									{review.helpful && review.helpful.count > 0 && (
										<small className="text-muted">
											{review.helpful.count} people found this helpful
										</small>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className="col-12">
						<div className="card border-0 shadow-sm">
							<div className="card-body text-center py-5 text-muted">
								No reviews found
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Response Modal */}
			{responseModal.show && (
				<div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Respond to Review</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setResponseModal({ reviewId: '', show: false })}
								/>
							</div>
							<div className="modal-body">
								<textarea
									className="form-control"
									rows={4}
									placeholder="Write your response..."
									value={responseText}
									onChange={(e) => setResponseText(e.target.value)}
								/>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setResponseModal({ reviewId: '', show: false })}
								>
									{tCommon('cancel')}
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleResponse}
									disabled={!responseText.trim() || processing === responseModal.reviewId}
								>
									{processing === responseModal.reviewId ? (
										<span className="spinner-border spinner-border-sm" />
									) : (
										'Send Response'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
