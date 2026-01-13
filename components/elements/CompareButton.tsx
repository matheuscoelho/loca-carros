'use client'

import { useCompare } from '@/context/CompareContext'
import { toastSuccess, toastWarning } from '@/components/ui/Toast'

interface CompareButtonProps {
  car: {
    _id: string
    name: string
    brand: string
    model: string
    year: number
    carType: string
    transmission: string
    fuelType: string
    specs: {
      seats: number
      doors: number
      bags: number
      mileage?: number
    }
    pricing: {
      dailyRate: number
      currency: string
    }
    images: Array<{ url: string; isPrimary?: boolean }>
    rating?: number
  }
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function CompareButton({
  car,
  size = 'md',
  showLabel = false,
  className = ''
}: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare()

  const inCompare = isInCompare(car._id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inCompare) {
      removeFromCompare(car._id)
      toastSuccess('Removido da comparação')
    } else {
      if (!canAddMore) {
        toastWarning('Máximo de 3 veículos para comparar')
        return
      }
      const added = addToCompare(car)
      if (added) {
        toastSuccess('Adicionado para comparar')
      }
    }
  }

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  }

  return (
    <button
      onClick={handleClick}
      className={`btn ${inCompare ? 'btn-primary' : 'btn-outline-secondary'} ${sizeClasses[size]} ${className}`}
      title={inCompare ? 'Remover da comparação' : 'Adicionar para comparar'}
      style={{
        borderRadius: showLabel ? '8px' : '50%',
        padding: showLabel ? undefined : '8px',
        minWidth: showLabel ? undefined : '40px',
        height: showLabel ? undefined : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}
    >
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <path d="M10 12h4" />
        <path d="M3 14h7v7H3z" />
        <path d="M14 14h7v7h-7z" />
      </svg>
      {showLabel && <span>{inCompare ? 'Comparando' : 'Comparar'}</span>}
    </button>
  )
}
