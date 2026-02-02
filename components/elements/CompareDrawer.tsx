'use client'

import { useCompare } from '@/context/CompareContext'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function CompareDrawer() {
  const t = useTranslations('compare')
  const { compareCars, removeFromCompare, clearCompare, showDrawer, setShowDrawer } = useCompare()

  if (compareCars.length === 0) {
    return null
  }

  return (
    <>
      {/* Floating Button - Mobile Toggle */}
      <button
        className="compare-floating-btn d-lg-none"
        onClick={() => setShowDrawer(!showDrawer)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '20px' }}>{compareCars.length}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '2px' }}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
        </svg>
      </button>

      {/* Drawer */}
      <div
        className={`compare-drawer ${showDrawer ? 'show' : ''}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
          zIndex: 1000,
          transform: showDrawer ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-out',
          maxHeight: '320px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          className="drawer-header d-flex justify-content-between align-items-center px-4 py-3"
          style={{ borderBottom: '1px solid #e5e7eb' }}
        >
          <div className="d-flex align-items-center gap-2">
            <h6 className="mb-0">{t('title')}</h6>
            <span className="badge bg-primary">{compareCars.length}/3</span>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={clearCompare}
            >
              {t('clear')}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowDrawer(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cars */}
        <div className="drawer-body flex-grow-1 overflow-auto px-4 py-3">
          <div className="d-flex gap-3">
            {compareCars.map((car) => (
              <div
                key={car._id}
                className="compare-car-item"
                style={{
                  minWidth: '200px',
                  maxWidth: '220px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromCompare(car._id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ×
                </button>

                {/* Image */}
                <img
                  src={car.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
                  alt={car.name}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                />

                {/* Info */}
                <h6 className="mb-1" style={{ fontSize: '14px' }}>{car.name}</h6>
                <p className="text-muted mb-2" style={{ fontSize: '12px' }}>
                  {car.brand} {car.model}
                </p>
                <p className="text-primary mb-0 fw-bold" style={{ fontSize: '14px' }}>
                  ${car.pricing?.dailyRate}/dia
                </p>
              </div>
            ))}

            {/* Add more placeholder */}
            {compareCars.length < 3 && (
              <Link
                href="/cars-list-1"
                className="d-flex flex-column align-items-center justify-content-center text-decoration-none"
                style={{
                  minWidth: '200px',
                  maxWidth: '220px',
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '2px dashed #cbd5e1',
                  color: '#64748b'
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                <span style={{ fontSize: '13px', marginTop: '8px' }}>{t('addVehicle')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="drawer-footer px-4 py-3"
          style={{ borderTop: '1px solid #e5e7eb' }}
        >
          <Link
            href="/compare"
            className={`btn btn-primary w-100 ${compareCars.length < 2 ? 'disabled' : ''}`}
            style={{
              pointerEvents: compareCars.length < 2 ? 'none' : 'auto',
              opacity: compareCars.length < 2 ? 0.5 : 1
            }}
          >
            {t('compareCount', { count: compareCars.length })}
            <svg className="ms-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          {compareCars.length < 2 && (
            <p className="text-center text-muted small mt-2 mb-0">
              {t('selectAtLeast2')}
            </p>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showDrawer && (
        <div
          onClick={() => setShowDrawer(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 998
          }}
        />
      )}
    </>
  )
}
