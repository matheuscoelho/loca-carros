'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  totalCars: number
  totalBookings: number
  recentTenants: Array<{
    _id: string
    name: string
    slug: string
    status: string
    usersCount: number
    carsCount: number
    createdAt: string
  }>
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/root-wl/stats')
      if (!response.ok) throw new Error('Erro ao carregar estatísticas')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError('Erro ao carregar estatísticas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-white-50 mb-0">Visão geral do sistema multi-tenant</p>
        </div>
        <Link href="/root-wl/tenants/new" className="btn btn-primary">
          + Novo Tenant
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Cards de estatísticas */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-25 p-3 me-3">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2">
                    <path d="M3 21h18" />
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-0 text-white">{stats?.totalTenants || 0}</h3>
                  <small className="text-white-50">Tenants Total</small>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge bg-success">{stats?.activeTenants || 0} ativos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-25 p-3 me-3">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-0 text-white">{stats?.totalUsers || 0}</h3>
                  <small className="text-white-50">Usuários Total</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-25 p-3 me-3">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2">
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-0 text-white">{stats?.totalCars || 0}</h3>
                  <small className="text-white-50">Veículos Total</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-25 p-3 me-3">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0dcaf0" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-0 text-white">{stats?.totalBookings || 0}</h3>
                  <small className="text-white-50">Reservas Total</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants recentes */}
      <div className="card bg-dark border-secondary">
        <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-white">Tenants Recentes</h5>
          <Link href="/root-wl/tenants" className="btn btn-sm btn-outline-light">
            Ver Todos
          </Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Usuários</th>
                  <th>Veículos</th>
                  <th>Criado em</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTenants?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-white-50 py-4">
                      Nenhum tenant cadastrado.{' '}
                      <Link href="/root-wl/tenants/new" className="text-primary">
                        Criar primeiro tenant
                      </Link>
                    </td>
                  </tr>
                ) : (
                  stats?.recentTenants?.map((tenant) => (
                    <tr key={tenant._id}>
                      <td>
                        <Link href={`/root-wl/tenants/${tenant._id}`} className="text-white text-decoration-none">
                          {tenant.name}
                        </Link>
                      </td>
                      <td>
                        <code className="bg-secondary px-2 py-1 rounded">{tenant.slug}</code>
                      </td>
                      <td>
                        <span className={`badge ${tenant.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                          {tenant.status === 'active' ? 'Ativo' : tenant.status}
                        </span>
                      </td>
                      <td>{tenant.usersCount}</td>
                      <td>{tenant.carsCount}</td>
                      <td>{new Date(tenant.createdAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
