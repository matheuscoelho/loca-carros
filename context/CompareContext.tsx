'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CompareCar {
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

interface CompareContextType {
  compareCars: CompareCar[]
  addToCompare: (car: CompareCar) => boolean
  removeFromCompare: (carId: string) => void
  isInCompare: (carId: string) => boolean
  clearCompare: () => void
  canAddMore: boolean
  showDrawer: boolean
  setShowDrawer: (show: boolean) => void
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

const MAX_COMPARE_ITEMS = 3

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareCars, setCompareCars] = useState<CompareCar[]>([])
  const [showDrawer, setShowDrawer] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compareCars')
    if (saved) {
      try {
        setCompareCars(JSON.parse(saved))
      } catch {
        localStorage.removeItem('compareCars')
      }
    }
  }, [])

  // Save to localStorage when changes
  useEffect(() => {
    localStorage.setItem('compareCars', JSON.stringify(compareCars))
  }, [compareCars])

  const addToCompare = (car: CompareCar): boolean => {
    if (compareCars.length >= MAX_COMPARE_ITEMS) {
      return false
    }
    if (compareCars.some(c => c._id === car._id)) {
      return false
    }
    setCompareCars(prev => [...prev, car])
    setShowDrawer(true)
    return true
  }

  const removeFromCompare = (carId: string) => {
    setCompareCars(prev => prev.filter(c => c._id !== carId))
  }

  const isInCompare = (carId: string): boolean => {
    return compareCars.some(c => c._id === carId)
  }

  const clearCompare = () => {
    setCompareCars([])
    setShowDrawer(false)
  }

  const canAddMore = compareCars.length < MAX_COMPARE_ITEMS

  return (
    <CompareContext.Provider value={{
      compareCars,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      canAddMore,
      showDrawer,
      setShowDrawer
    }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
