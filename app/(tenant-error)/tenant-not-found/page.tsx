'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function TenantNotFoundPage() {
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dominio Nao Configurado
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          O dominio <span className="font-semibold text-gray-800">{hostname}</span> nao
          esta configurado em nosso sistema.
        </p>

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Possiveis motivos:</strong>
          </p>
          <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
            <li>O dominio foi digitado incorretamente</li>
            <li>A locadora ainda nao foi cadastrada</li>
            <li>O dominio ainda nao foi configurado</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Se voce e o proprietario desta locadora, entre em contato com o suporte
            para configurar seu dominio.
          </p>

          <Link
            href="https://navegarsistemas.com.br"
            className="inline-block w-full py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Ir para o Site Principal
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          Navegar Sistemas - Plataforma de Aluguel de Veiculos
        </p>
      </div>
    </div>
  )
}
