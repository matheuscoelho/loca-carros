'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/super-admin',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Tenants',
    href: '/super-admin/tenants',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M9 8h1" />
        <path d="M9 12h1" />
        <path d="M9 16h1" />
        <path d="M14 8h1" />
        <path d="M14 12h1" />
        <path d="M14 16h1" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      </svg>
    ),
  },
]

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Verificar se está na página de login do super-admin
  const isLoginPage = pathname === '/super-admin/login'

  useEffect(() => {
    // Não redirecionar se estiver na página de login
    if (isLoginPage) return

    if (status === 'unauthenticated') {
      router.push('/super-admin/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'super_admin') {
      router.push('/dashboard')
    }
  }, [status, session, router, isLoginPage])

  // Página de login tem layout próprio
  if (isLoginPage) {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'super_admin') {
    return null
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className={`bg-dark text-white ${sidebarOpen ? 'd-block' : 'd-none d-lg-block'}`}
        style={{
          width: '260px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1040,
          overflowY: 'auto',
        }}
      >
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <span className="badge bg-danger me-2">Super</span>
            <h5 className="mb-0 text-white">Admin</h5>
          </div>
          <small className="text-muted">Gerenciamento Global</small>
        </div>

        <nav className="p-3">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.href} className="nav-item mb-1">
                <Link
                  href={item.href}
                  className={`nav-link d-flex align-items-center gap-2 rounded ${
                    pathname === item.href ? 'bg-primary text-white' : 'text-white-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="border-secondary my-4" />

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                href="/"
                className="nav-link d-flex align-items-center gap-2 text-white-50"
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Voltar ao Site
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1035 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <main
        className="flex-grow-1"
        style={{
          marginLeft: '260px',
          backgroundColor: '#1a1d21',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 bg-dark border-bottom border-secondary"
          style={{ position: 'sticky', top: 0, zIndex: 1030 }}
        >
          <button
            className="btn btn-link text-white d-lg-none p-0"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-white-50 d-none d-sm-inline">
              {session.user.email}
            </span>
            <span className="badge bg-danger">Super Admin</span>
          </div>
        </div>

        {/* Conteúdo da página */}
        <div className="p-4 text-white">
          {children}
        </div>
      </main>

      <style jsx global>{`
        .super-admin-layout .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}
