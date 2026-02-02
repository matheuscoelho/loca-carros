'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    userId: string
    name: string
    email: string
  }
  subscription: {
    plan: string
    status: string
  }
  limits: {
    maxUsers: number
    maxCars: number
  }
  status: string
  usersCount: number
  carsCount: number
  bookingsCount: number
  createdAt: string
  updatedAt: string
}

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tenantId = params.id as string

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    status: '',
    plan: '',
    maxUsers: 0,
    maxCars: 0,
    customDomains: '',
  })

  const [newDomain, setNewDomain] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const fetchTenant = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/root-wl/tenants/${tenantId}`)
      if (!response.ok) throw new Error('Erro ao carregar tenant')
      const data = await response.json()
      setTenant(data.tenant)
      setFormData({
        name: data.tenant.name,
        status: data.tenant.status,
        plan: data.tenant.subscription.plan,
        maxUsers: data.tenant.limits.maxUsers,
        maxCars: data.tenant.limits.maxCars,
        customDomains: data.tenant.domains.custom.join('\n'),
      })
    } catch (err) {
      setError('Erro ao carregar dados do tenant')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    fetchTenant()
  }, [fetchTenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const customDomains = formData.customDomains
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0)

      const response = await fetch(`/api/root-wl/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          subscription: { plan: formData.plan },
          limits: {
            maxUsers: formData.maxUsers,
            maxCars: formData.maxCars,
          },
          domains: { custom: customDomains },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSuccess('Tenant atualizado com sucesso!')
      fetchTenant()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja desativar este tenant? Esta ação pode ser revertida.')) {
      return
    }

    try {
      const response = await fetch(`/api/root-wl/tenants/${tenantId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao deletar')

      router.push('/root-wl/tenants')
    } catch (err) {
      setError('Erro ao desativar tenant')
      console.error(err)
    }
  }

  const handleResetPassword = async () => {
    if (!adminPassword || adminPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setSavingPassword(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/root-wl/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao alterar senha')
      }

      setSuccess('Senha do administrador alterada com sucesso!')
      setAdminPassword('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha')
    } finally {
      setSavingPassword(false)
    }
  }

  const addCustomDomain = () => {
    if (!newDomain.trim()) return

    const currentDomains = formData.customDomains
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0)

    if (!currentDomains.includes(newDomain.trim())) {
      currentDomains.push(newDomain.trim())
      setFormData(prev => ({
        ...prev,
        customDomains: currentDomains.join('\n'),
      }))
    }
    setNewDomain('')
  }

  const planLabels: Record<string, string> = {
    free: 'Gratuito',
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-5">
        <p className="text-white-50">Tenant não encontrado</p>
        <Link href="/root-wl/tenants" className="btn btn-primary">
          Voltar para lista
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link href="/root-wl/tenants" className="btn btn-outline-light btn-sm">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-grow-1">
          <h2 className="mb-1">{tenant.name}</h2>
          <p className="text-white-50 mb-0">
            <code className="bg-secondary px-2 py-1 rounded">{tenant.domains.primary}</code>
          </p>
        </div>
        <span className={`badge fs-6 ${
          tenant.status === 'active' ? 'bg-success' :
          tenant.status === 'suspended' ? 'bg-danger' : 'bg-warning'
        }`}>
          {tenant.status === 'active' ? 'Ativo' :
           tenant.status === 'suspended' ? 'Suspenso' : 'Inativo'}
        </span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        {/* Estatísticas */}
        <div className="col-12 mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card bg-dark border-secondary text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-0">{tenant.usersCount}</h3>
                  <small className="text-white-50">Usuários</small>
                  <div className="small text-white-50 mt-1">
                    Limite: {tenant.limits.maxUsers === -1 ? '∞' : tenant.limits.maxUsers}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-dark border-secondary text-center">
                <div className="card-body">
                  <h3 className="text-info mb-0">{tenant.carsCount}</h3>
                  <small className="text-white-50">Carros</small>
                  <div className="small text-white-50 mt-1">
                    Limite: {tenant.limits.maxCars === -1 ? '∞' : tenant.limits.maxCars}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-dark border-secondary text-center">
                <div className="card-body">
                  <h3 className="text-success mb-0">{tenant.bookingsCount}</h3>
                  <small className="text-white-50">Reservas</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-dark border-secondary text-center">
                <div className="card-body">
                  <h3 className="mb-0">
                    <span className={`badge ${
                      tenant.subscription.plan === 'enterprise' ? 'bg-warning text-dark' :
                      tenant.subscription.plan === 'professional' ? 'bg-primary' :
                      tenant.subscription.plan === 'starter' ? 'bg-info' : 'bg-secondary'
                    }`}>
                      {planLabels[tenant.subscription.plan]}
                    </span>
                  </h3>
                  <small className="text-white-50">Plano</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de edição */}
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary">
            <div className="card-header bg-transparent border-secondary">
              <h5 className="mb-0 text-white">Editar Tenant</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-white">Nome da Locadora</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white">Slug</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      value={tenant.slug}
                      disabled
                    />
                    <small className="text-white-50">O slug não pode ser alterado</small>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label text-white">Status</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-white">Plano</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={formData.plan}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                    >
                      <option value="free">Gratuito</option>
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <hr className="border-secondary" />

                <h6 className="text-white mb-3">Limites</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label text-white">Max Usuários</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                      min={-1}
                    />
                    <small className="text-white-50">-1 para ilimitado</small>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-white">Max Carros</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.maxCars}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxCars: parseInt(e.target.value) }))}
                      min={-1}
                    />
                    <small className="text-white-50">-1 para ilimitado</small>
                  </div>
                </div>

                <hr className="border-secondary" />

                <h6 className="text-white mb-3">Domínios Customizados</h6>
                <div className="mb-3">
                  <label className="form-label text-white">Domínio Primário</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    value={tenant.domains.primary}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Adicionar Domínio</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="www.seudominio.com.br"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-primary" onClick={addCustomDomain}>
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-white">Domínios Custom (um por linha)</label>
                  <textarea
                    className="form-control bg-dark text-white border-secondary"
                    rows={3}
                    value={formData.customDomains}
                    onChange={(e) => setFormData(prev => ({ ...prev, customDomains: e.target.value }))}
                    placeholder="www.locadora.com.br&#10;app.locadora.com"
                  />
                  <small className="text-white-50">
                    Configure um CNAME apontando para {process.env.NEXT_PUBLIC_BASE_DOMAIN || 'seusite.com'}
                  </small>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-header bg-transparent border-secondary">
              <h6 className="mb-0 text-white">Administrador</h6>
            </div>
            <div className="card-body">
              <p className="mb-1 text-white">{tenant.owner.name}</p>
              <p className="mb-3 text-white-50 small">{tenant.owner.email}</p>

              <hr className="border-secondary" />

              <label className="form-label text-white small">Nova Senha</label>
              <div className="input-group input-group-sm mb-2">
                <input
                  type="password"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Mínimo 6 caracteres"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-warning"
                  onClick={handleResetPassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? '...' : 'Alterar'}
                </button>
              </div>
              <small className="text-white-50">Alterar senha do admin</small>
            </div>
          </div>

          <div className="card bg-dark border-secondary mb-4">
            <div className="card-header bg-transparent border-secondary">
              <h6 className="mb-0 text-white">Datas</h6>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <small className="text-white-50">Criado em:</small>
                <p className="mb-0 text-white">
                  {new Date(tenant.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <small className="text-white-50">Atualizado em:</small>
                <p className="mb-0 text-white">
                  {new Date(tenant.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-dark border-danger">
            <div className="card-header bg-transparent border-danger">
              <h6 className="mb-0 text-danger">Zona de Perigo</h6>
            </div>
            <div className="card-body">
              <p className="text-white-50 small mb-3">
                Desativar o tenant irá impedir o acesso de todos os usuários.
              </p>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
              >
                Desativar Tenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
