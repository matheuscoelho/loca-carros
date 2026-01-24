'use client'

import { useState, useEffect } from 'react'

export default function TenantNotFoundPage() {
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: 32,
        textAlign: 'center'
      }}>
        {/* Icon */}
        <div style={{
          width: 72,
          height: 72,
          margin: '0 auto 20px',
          backgroundColor: '#FEE2E2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg
            style={{ width: 36, height: 36 }}
            fill="none"
            stroke="#EF4444"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#111827',
          marginBottom: 8
        }}>
          Dominio Nao Configurado
        </h1>

        {/* Message */}
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          O dominio <span style={{ fontWeight: 600, color: '#374151' }}>{hostname}</span> nao
          esta configurado em nosso sistema.
        </p>

        {/* Details */}
        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          textAlign: 'left'
        }}>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
            <strong>Possiveis motivos:</strong>
          </p>
          <ul style={{ fontSize: 14, color: '#9CA3AF', paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 4 }}>O dominio foi digitado incorretamente</li>
            <li style={{ marginBottom: 4 }}>A locadora ainda nao foi cadastrada</li>
            <li>O dominio ainda nao foi configurado</li>
          </ul>
        </div>

        {/* Actions */}
        <div>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 12 }}>
            Se voce e o proprietario desta locadora, entre em contato com o suporte
            para configurar seu dominio.
          </p>

          <a
            href="https://navegarsistemas.com.br"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#22C55E',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 500,
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
          >
            Ir para o Site do Desenvolvedor
          </a>
        </div>

        {/* Footer */}
        <p style={{ marginTop: 24, fontSize: 12, color: '#9CA3AF' }}>
          Navegar Sistemas - Plataforma de Aluguel de Veiculos
        </p>
      </div>
    </div>
  )
}
