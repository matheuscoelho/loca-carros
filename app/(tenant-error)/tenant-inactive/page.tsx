'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function TenantInactivePage() {
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-yellow-500"
            fill="none"
            stroke="currentColor"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Locadora Temporariamente Indisponivel
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          A locadora em <span className="font-semibold text-gray-800">{hostname}</span> esta
          temporariamente fora do ar.
        </p>

        {/* Details */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800">
            <strong>O que pode ter acontecido:</strong>
          </p>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
            <li>Manutencao programada</li>
            <li>Conta suspensa temporariamente</li>
            <li>Problemas tecnicos</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Por favor, tente novamente mais tarde ou entre em contato com a locadora
            diretamente.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="inline-block w-full py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Tentar Novamente
          </button>

          <Link
            href="https://navegarsistemas.com.br"
            className="inline-block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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
