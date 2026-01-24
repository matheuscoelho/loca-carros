'use client'

import { useState, useEffect } from 'react'

export default function TenantInactivePage() {
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
          backgroundColor: '#FEF3C7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg
            style={{ width: 36, height: 36 }}
            fill="none"
            stroke="#F59E0B"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
          Locadora Temporariamente Indisponivel
        </h1>

        {/* Message */}
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          A locadora em <span style={{ fontWeight: 600, color: '#374151' }}>{hostname}</span> esta
          temporariamente fora do ar.
        </p>

        {/* Details */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          textAlign: 'left'
        }}>
          <p style={{ fontSize: 14, color: '#92400E', marginBottom: 8 }}>
            <strong>O que pode ter acontecido:</strong>
          </p>
          <ul style={{ fontSize: 14, color: '#B45309', paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 4 }}>Manutencao programada</li>
            <li style={{ marginBottom: 4 }}>Conta suspensa temporariamente</li>
            <li>Problemas tecnicos</li>
          </ul>
        </div>

        {/* Actions */}
        <div>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 12 }}>
            Por favor, tente novamente mais tarde ou entre em contato com a locadora
            diretamente.
          </p>

          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#374151',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 12,
              boxSizing: 'border-box'
            }}
          >
            Tentar Novamente
          </button>

          <a
            href="https://navegarsistemas.com.br"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#374151',
              borderRadius: 8,
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid #D1D5DB',
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
