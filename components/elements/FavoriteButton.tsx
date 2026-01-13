'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useFavorites } from '@/context/FavoritesContext'

interface FavoriteButtonProps {
	carId: string
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({ carId, className = '', size = 'md' }: FavoriteButtonProps) {
	const { data: session } = useSession()
	const router = useRouter()
	const { isFavorite, toggleFavorite, loading } = useFavorites()
	const [isToggling, setIsToggling] = useState(false)

	const favorite = isFavorite(carId)

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (!session?.user) {
			router.push('/login')
			return
		}

		try {
			setIsToggling(true)
			await toggleFavorite(carId)
		} catch (error) {
			console.error('Error toggling favorite:', error)
		} finally {
			setIsToggling(false)
		}
	}

	const sizeClasses = {
		sm: 'btn-sm',
		md: '',
		lg: 'btn-lg',
	}

	const iconSize = {
		sm: '14px',
		md: '18px',
		lg: '22px',
	}

	return (
		<button
			className={`btn ${favorite ? 'btn-danger' : 'btn-outline-danger'} ${sizeClasses[size]} ${className}`}
			onClick={handleClick}
			disabled={isToggling || loading}
			title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
			style={{
				borderRadius: '50%',
				width: size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px',
				height: size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px',
				padding: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{isToggling ? (
				<span className="spinner-border spinner-border-sm" />
			) : (
				<span style={{ fontSize: iconSize[size] }}>
					{favorite ? '❤️' : '🤍'}
				</span>
			)}
		</button>
	)
}
