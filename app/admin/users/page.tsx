'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface User {
	_id: string
	email: string
	name: string
	phone?: string
	role: string
	status: string
	createdAt: string
	lastLogin?: string
	bookingsCount?: number
}

export default function AdminUsersPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [roleFilter, setRoleFilter] = useState('all')

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/admin/users')
			if (!response.ok) {
				throw new Error('Failed to fetch users')
			}
			const data = await response.json()
			setUsers(data.users)
		} catch (err) {
			setError('Error loading users')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleRoleChange = async (id: string, newRole: string) => {
		try {
			const response = await fetch(`/api/admin/users/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: newRole }),
			})

			if (response.ok) {
				setUsers(users.map(user =>
					user._id === id ? { ...user, role: newRole } : user
				))
			}
		} catch (err) {
			console.error('Error updating role:', err)
		}
	}

	const handleStatusChange = async (id: string, newStatus: string) => {
		try {
			const response = await fetch(`/api/admin/users/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			})

			if (response.ok) {
				setUsers(users.map(user =>
					user._id === id ? { ...user, status: newStatus } : user
				))
			}
		} catch (err) {
			console.error('Error updating status:', err)
		}
	}

	const filteredUsers = users.filter(user => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesRole = roleFilter === 'all' || user.role === roleFilter
		return matchesSearch && matchesRole
	})

	const getStatusBadge = (status: string) => {
		const badges: Record<string, string> = {
			active: 'bg-success',
			inactive: 'bg-secondary',
			suspended: 'bg-danger',
		}
		return badges[status] || 'bg-secondary'
	}

	const getRoleBadge = (role: string) => {
		const badges: Record<string, string> = {
			admin: 'bg-danger',
			cliente: 'bg-primary',
		}
		return badges[role] || 'bg-secondary'
	}

	if (loading) {
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
				<h1 className="h3 mb-0">{t('users.title')}</h1>
			</div>

			{/* Stats Cards */}
			<div className="row g-3 mb-4">
				<div className="col-md-3">
					<div className="card border-0 shadow-sm">
						<div className="card-body text-center">
							<h3 className="text-primary mb-0">{users.length}</h3>
							<small className="text-muted">Total Users</small>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm">
						<div className="card-body text-center">
							<h3 className="text-success mb-0">{users.filter(u => u.status === 'active').length}</h3>
							<small className="text-muted">Active</small>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm">
						<div className="card-body text-center">
							<h3 className="text-danger mb-0">{users.filter(u => u.role === 'admin').length}</h3>
							<small className="text-muted">Admins</small>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm">
						<div className="card-body text-center">
							<h3 className="text-info mb-0">{users.filter(u => u.role === 'cliente').length}</h3>
							<small className="text-muted">Clients</small>
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
								placeholder={`${tCommon('search')} by name or email...`}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="col-md-3">
							<select
								className="form-select"
								value={roleFilter}
								onChange={(e) => setRoleFilter(e.target.value)}
							>
								<option value="all">{tCommon('all')} Roles</option>
								<option value="admin">Admin</option>
								<option value="cliente">Client</option>
							</select>
						</div>
						<div className="col-md-3 text-end">
							<span className="text-muted">
								{filteredUsers.length} users
							</span>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="alert alert-danger">{error}</div>
			)}

			{/* Users Table */}
			<div className="card border-0 shadow-sm">
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-hover mb-0">
							<thead className="bg-light">
								<tr>
									<th className="border-0">User</th>
									<th className="border-0">{t('users.role')}</th>
									<th className="border-0">{t('users.status')}</th>
									<th className="border-0">{t('users.lastLogin')}</th>
									<th className="border-0">{t('users.totalRentals')}</th>
									<th className="border-0">Registered</th>
									<th className="border-0">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.length > 0 ? (
									filteredUsers.map((user) => (
										<tr key={user._id}>
											<td>
												<div className="d-flex align-items-center">
													<div
														className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
														style={{ width: '40px', height: '40px' }}
													>
														{user.name.charAt(0).toUpperCase()}
													</div>
													<div>
														<strong>{user.name}</strong>
														<br />
														<small className="text-muted">{user.email}</small>
														{user.phone && (
															<>
																<br />
																<small className="text-muted">{user.phone}</small>
															</>
														)}
													</div>
												</div>
											</td>
											<td>
												<select
													className="form-select form-select-sm"
													value={user.role}
													onChange={(e) => handleRoleChange(user._id, e.target.value)}
													style={{ width: '100px' }}
												>
													<option value="cliente">Client</option>
													<option value="admin">Admin</option>
												</select>
											</td>
											<td>
												<select
													className={`form-select form-select-sm`}
													value={user.status}
													onChange={(e) => handleStatusChange(user._id, e.target.value)}
													style={{ width: '110px' }}
												>
													<option value="active">Active</option>
													<option value="inactive">Inactive</option>
													<option value="suspended">Suspended</option>
												</select>
											</td>
											<td>
												{user.lastLogin ? (
													<small>{new Date(user.lastLogin).toLocaleString()}</small>
												) : (
													<small className="text-muted">Never</small>
												)}
											</td>
											<td>
												<span className="badge bg-light text-dark">
													{user.bookingsCount || 0}
												</span>
											</td>
											<td>
												<small>{new Date(user.createdAt).toLocaleDateString()}</small>
											</td>
											<td>
												<button
													className="btn btn-sm btn-outline-primary"
													onClick={() => alert('View user details - Coming soon')}
												>
													{tCommon('view')}
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={7} className="text-center py-4 text-muted">
											No users found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
