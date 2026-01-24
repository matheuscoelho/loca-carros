'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewTenantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    plan: 'starter',
  })

  // Gerar slug automaticamente a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/super-admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar tenant')
      }

      router.push('/super-admin/tenants')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tenant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link href="/super-admin/tenants" className="btn btn-outline-light btn-sm">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="mb-1">Novo Tenant</h2>
          <p className="text-white-50 mb-0">Cadastre uma nova locadora no sistema</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                <h5 className="text-white mb-3">Informações do Tenant</h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-white">Nome da Locadora</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Ex: Locadora Alpha"
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white">Slug (subdomínio)</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="locadora-alpha"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                        pattern="^[a-z0-9]([a-z0-9-]*[a-z0-9])?$"
                        minLength={3}
                        maxLength={50}
                      />
                      <span className="input-group-text bg-secondary border-secondary text-white">
                        .{process.env.NEXT_PUBLIC_BASE_DOMAIN || 'seusite.com'}
                      </span>
                    </div>
                    <small className="text-white-50">Apenas letras minúsculas, números e hífens</small>
                  </div>
                </div>

                <hr className="border-secondary" />

                <h5 className="text-white mb-3">Administrador do Tenant</h5>
                <p className="text-white-50 small mb-3">
                  Este será o primeiro usuário admin da locadora.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-white">Nome do Admin</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Nome completo"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white">Email do Admin</label>
                    <input
                      type="email"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="admin@locadora.com"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white">Senha</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.ownerPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <hr className="border-secondary" />

                <h5 className="text-white mb-3">Plano</h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-white">Plano Inicial</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={formData.plan}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                    >
                      <option value="free">Gratuito (5 usuários, 10 carros)</option>
                      <option value="starter">Starter (15 usuários, 50 carros)</option>
                      <option value="professional">Professional (50 usuários, 200 carros)</option>
                      <option value="enterprise">Enterprise (ilimitado)</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Criando...
                      </>
                    ) : (
                      'Criar Tenant'
                    )}
                  </button>
                  <Link href="/super-admin/tenants" className="btn btn-outline-secondary">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary">
            <div className="card-header bg-transparent border-secondary">
              <h6 className="mb-0 text-white">O que será criado?</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled text-white-50 mb-0">
                <li className="mb-2">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" className="me-2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tenant com subdomínio
                </li>
                <li className="mb-2">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" className="me-2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Usuário admin
                </li>
                <li className="mb-2">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" className="me-2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Configurações padrão
                </li>
                <li>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2" className="me-2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Branding personalizável
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
