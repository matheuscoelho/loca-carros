'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Tenant {
  _id: string
  name: string
  slug: string
  domains: {
    primary: string
    custom: string[]
  }
  owner: {
    name: string
    email: string
  }
  subscription: {
    plan: string
    status: string
  }
  status: string
  usersCount: number
  carsCount: number
  createdAt: string
}

export default function TenantsListPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/root-wl/tenants?${params}`)
      if (!response.ok) throw new Error('Erro ao carregar tenants')
      const data = await response.json()
      setTenants(data.tenants)
    } catch (err) {
      setError('Erro ao carregar tenants')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const handleStatusChange = async (tenantId: string, newStatus: string) => {
    if (!confirm(`Tem certeza que deseja ${newStatus === 'active' ? 'ativar' : 'suspender'} este tenant?`)) {
      return
    }

    try {
      const response = await fetch(`/api/root-wl/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Erro ao atualizar status')
      fetchTenants()
    } catch (err) {
      alert('Erro ao atualizar status do tenant')
      console.error(err)
    }
  }

  const planLabels: Record<string, string> = {
    free: 'Gratuito',
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Tenants</h2>
          <p className="text-white-50 mb-0">Gerencie todos os tenants do sistema</p>
        </div>
        <Link href="/root-wl/tenants/new" className="btn btn-primary">
          + Novo Tenant
        </Link>
      </div>

      {/* Filtros */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-white-50">Status</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="suspended">Suspensos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Lista de tenants */}
      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-5 text-white-50">
              <p className="mb-3">Nenhum tenant encontrado</p>
              <Link href="/root-wl/tenants/new" className="btn btn-primary">
                Criar Primeiro Tenant
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Domínio</th>
                    <th>Plano</th>
                    <th>Status</th>
                    <th>Recursos</th>
                    <th>Criado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant._id}>
                      <td>
                        <div>
                          <Link
                            href={`/root-wl/tenants/${tenant._id}`}
                            className="text-white text-decoration-none fw-bold"
                          >
                            {tenant.name}
                          </Link>
                          <div className="small text-white-50">{tenant.owner.email}</div>
                        </div>
                      </td>
                      <td>
                        <code className="bg-secondary px-2 py-1 rounded small">
                          {tenant.slug}
                        </code>
                        {tenant.domains.custom.length > 0 && (
                          <span className="badge bg-info ms-2" title={tenant.domains.custom.join(', ')}>
                            +{tenant.domains.custom.length}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          tenant.subscription.plan === 'enterprise' ? 'bg-warning text-dark' :
                          tenant.subscription.plan === 'professional' ? 'bg-primary' :
                          tenant.subscription.plan === 'starter' ? 'bg-info' : 'bg-secondary'
                        }`}>
                          {planLabels[tenant.subscription.plan] || tenant.subscription.plan}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          tenant.status === 'active' ? 'bg-success' :
                          tenant.status === 'suspended' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {tenant.status === 'active' ? 'Ativo' :
                           tenant.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <span className="me-3">
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          {tenant.usersCount}
                        </span>
                        <span>
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                          </svg>
                          {tenant.carsCount}
                        </span>
                      </td>
                      <td className="small text-white-50">
                        {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            href={`/root-wl/tenants/${tenant._id}`}
                            className="btn btn-outline-light"
                          >
                            Editar
                          </Link>
                          {tenant.status === 'active' ? (
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => handleStatusChange(tenant._id, 'suspended')}
                            >
                              Suspender
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleStatusChange(tenant._id, 'active')}
                            >
                              Ativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
