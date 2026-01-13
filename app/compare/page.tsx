'use client'

import { useCompare } from '@/context/CompareContext'
import Layout from "@/components/layout/Layout"
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ComparePage() {
  const { compareCars, removeFromCompare, clearCompare } = useCompare()
  const t = useTranslations('vehicles')

  if (compareCars.length === 0) {
    return (
      <Layout footerStyle={1}>
        <div className="container pt-140 pb-170">
          <div className="text-center">
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
            <h3>Nenhum veículo para comparar</h3>
            <p className="text-muted mb-4">
              Adicione veículos à lista de comparação para ver as diferenças lado a lado.
            </p>
            <Link href="/cars-list-1" className="btn btn-primary">
              Ver Veículos
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const specs = [
    { key: 'brand', label: 'Marca', getValue: (car: any) => car.brand },
    { key: 'model', label: 'Modelo', getValue: (car: any) => car.model },
    { key: 'year', label: 'Ano', getValue: (car: any) => car.year },
    { key: 'carType', label: 'Tipo', getValue: (car: any) => car.carType },
    { key: 'transmission', label: 'Transmissão', getValue: (car: any) => car.transmission },
    { key: 'fuelType', label: 'Combustível', getValue: (car: any) => car.fuelType },
    { key: 'seats', label: 'Assentos', getValue: (car: any) => car.specs?.seats },
    { key: 'doors', label: 'Portas', getValue: (car: any) => car.specs?.doors },
    { key: 'bags', label: 'Bagagens', getValue: (car: any) => car.specs?.bags },
    { key: 'mileage', label: 'Quilometragem', getValue: (car: any) => car.specs?.mileage ? `${car.specs.mileage.toLocaleString()} km` : '-' },
    { key: 'rating', label: 'Avaliação', getValue: (car: any) => car.rating ? `⭐ ${car.rating.toFixed(1)}` : '-' },
    { key: 'price', label: 'Preço/dia', getValue: (car: any) => `$${car.pricing?.dailyRate}` },
  ]

  return (
    <Layout footerStyle={1}>
      <div className="container pt-140 pb-170">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Comparar Veículos</h2>
            <p className="text-muted mb-0">
              Comparando {compareCars.length} veículo{compareCars.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={clearCompare}>
              Limpar Comparação
            </button>
            <Link href="/cars-list-1" className="btn btn-outline-primary">
              + Adicionar Mais
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="comparison-table border rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead>
                <tr className="bg-light">
                  <th style={{ width: '180px', minWidth: '180px' }}></th>
                  {compareCars.map((car) => (
                    <th key={car._id} className="text-center" style={{ minWidth: '250px' }}>
                      <div className="position-relative">
                        <button
                          onClick={() => removeFromCompare(car._id)}
                          className="btn btn-sm btn-danger position-absolute"
                          style={{ top: '-5px', right: '-5px', padding: '2px 8px' }}
                        >
                          ×
                        </button>
                        <img
                          src={car.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
                          alt={car.name}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '10px'
                          }}
                        />
                        <h5 className="mb-2">{car.name}</h5>
                        <p className="text-primary h4 mb-3">
                          ${car.pricing?.dailyRate}<small className="text-muted">/dia</small>
                        </p>
                        <Link
                          href={`/booking/${car._id}`}
                          className="btn btn-primary btn-sm w-100"
                        >
                          {t('bookNow')}
                        </Link>
                      </div>
                    </th>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: 3 - compareCars.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="text-center bg-light" style={{ minWidth: '250px' }}>
                      <Link
                        href="/cars-list-1"
                        className="d-flex flex-column align-items-center justify-content-center text-decoration-none py-5"
                        style={{ color: '#64748b' }}
                      >
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v8M8 12h8" />
                        </svg>
                        <span className="mt-3">Adicionar veículo</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.key}>
                    <td className="bg-light fw-bold">{spec.label}</td>
                    {compareCars.map((car) => {
                      const value = spec.getValue(car)
                      // Highlight best price
                      const isBestPrice = spec.key === 'price' &&
                        car.pricing?.dailyRate === Math.min(...compareCars.map(c => c.pricing?.dailyRate || Infinity))

                      return (
                        <td
                          key={car._id}
                          className={`text-center ${isBestPrice ? 'bg-success bg-opacity-10 text-success fw-bold' : ''}`}
                        >
                          {value || '-'}
                          {isBestPrice && compareCars.length > 1 && (
                            <span className="badge bg-success ms-2">Melhor</span>
                          )}
                        </td>
                      )
                    })}
                    {/* Empty cells */}
                    {Array.from({ length: 3 - compareCars.length }).map((_, i) => (
                      <td key={`empty-${spec.key}-${i}`} className="bg-light text-center">-</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 text-center">
          <span className="badge bg-success me-2">Melhor preço</span>
          <span className="text-muted small">= Melhor valor entre os comparados</span>
        </div>
      </div>
    </Layout>
  )
}
