'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface FavoritesContextType {
	favorites: string[]
	loading: boolean
	isFavorite: (carId: string) => boolean
	addFavorite: (carId: string) => Promise<void>
	removeFavorite: (carId: string) => Promise<void>
	toggleFavorite: (carId: string) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const { data: session } = useSession()
	const [favorites, setFavorites] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (session?.user) {
			fetchFavorites()
		} else {
			setFavorites([])
		}
	}, [session])

	const fetchFavorites = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/favorites')
			if (response.ok) {
				const data = await response.json()
				setFavorites(data.favorites || [])
			}
		} catch (error) {
			console.error('Error fetching favorites:', error)
		} finally {
			setLoading(false)
		}
	}

	const isFavorite = (carId: string) => {
		return favorites.includes(carId)
	}

	const addFavorite = async (carId: string) => {
		if (!session?.user) {
			throw new Error('Must be logged in')
		}

		try {
			const response = await fetch('/api/favorites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ carId }),
			})

			if (response.ok) {
				setFavorites(prev => [...prev, carId])
			}
		} catch (error) {
			console.error('Error adding favorite:', error)
			throw error
		}
	}

	const removeFavorite = async (carId: string) => {
		if (!session?.user) {
			throw new Error('Must be logged in')
		}

		try {
			const response = await fetch(`/api/favorites?carId=${carId}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				setFavorites(prev => prev.filter(id => id !== carId))
			}
		} catch (error) {
			console.error('Error removing favorite:', error)
			throw error
		}
	}

	const toggleFavorite = async (carId: string) => {
		if (isFavorite(carId)) {
			await removeFavorite(carId)
		} else {
			await addFavorite(carId)
		}
	}

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				loading,
				isFavorite,
				addFavorite,
				removeFavorite,
				toggleFavorite,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	)
}

export function useFavorites() {
	const context = useContext(FavoritesContext)
	if (context === undefined) {
		throw new Error('useFavorites must be used within a FavoritesProvider')
	}
	return context
}
