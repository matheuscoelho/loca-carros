'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Vehicle {
	_id: string
	name: string
	brand: string
	model: string
	carType: string
	images?: Array<{ url: string }>
	pricing?: {
		dailyRate: number
		currency: string
	}
}

interface SearchAutocompleteProps {
	placeholder?: string
	className?: string
	onSelect?: (vehicle: Vehicle) => void
	variant?: 'light' | 'dark'
}

const RECENT_SEARCHES_KEY = 'navegar_sistemas_recent_searches'
const MAX_RECENT_SEARCHES = 5

export default function SearchAutocomplete({
	placeholder,
	className = '',
	onSelect,
	variant = 'light'
}: SearchAutocompleteProps) {
	const t = useTranslations('vehicles')
	const router = useRouter()
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<Vehicle[]>([])
	const [recentSearches, setRecentSearches] = useState<string[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const debounceRef = useRef<NodeJS.Timeout | null>(null)

	// Load recent searches from localStorage
	useEffect(() => {
		const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
		if (saved) {
			try {
				setRecentSearches(JSON.parse(saved))
			} catch (e) {
				console.error('Error loading recent searches:', e)
			}
		}
	}, [])

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Search function with debounce
	const searchVehicles = useCallback(async (searchQuery: string) => {
		if (searchQuery.length < 2) {
			setResults([])
			setLoading(false)
			return
		}

		setLoading(true)
		try {
			const res = await fetch(`/api/cars?search=${encodeURIComponent(searchQuery)}&limit=6`)
			if (res.ok) {
				const data = await res.json()
				setResults(data.cars || [])
			}
		} catch (error) {
			console.error('Search error:', error)
			setResults([])
		} finally {
			setLoading(false)
		}
	}, [])

	// Handle input change with debounce
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setQuery(value)
		setSelectedIndex(-1)

		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}

		if (value.length >= 2) {
			setLoading(true)
			debounceRef.current = setTimeout(() => {
				searchVehicles(value)
			}, 300)
		} else {
			setResults([])
			setLoading(false)
		}
	}

	// Save to recent searches
	const saveRecentSearch = (searchTerm: string) => {
		const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, MAX_RECENT_SEARCHES)
		setRecentSearches(updated)
		localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
	}

	// Handle vehicle selection
	const handleSelect = (vehicle: Vehicle) => {
		saveRecentSearch(vehicle.name)
		setQuery(vehicle.name)
		setIsOpen(false)

		if (onSelect) {
			onSelect(vehicle)
		} else {
			router.push(`/cars/${vehicle._id}`)
		}
	}

	// Handle recent search click
	const handleRecentClick = (search: string) => {
		setQuery(search)
		searchVehicles(search)
	}

	// Clear recent searches
	const clearRecentSearches = () => {
		setRecentSearches([])
		localStorage.removeItem(RECENT_SEARCHES_KEY)
	}

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		const items = results.length > 0 ? results : []

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev))
				break
			case 'ArrowUp':
				e.preventDefault()
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
				break
			case 'Enter':
				e.preventDefault()
				if (selectedIndex >= 0 && results[selectedIndex]) {
					handleSelect(results[selectedIndex])
				} else if (query.length >= 2) {
					saveRecentSearch(query)
					router.push(`/cars-list-1?search=${encodeURIComponent(query)}`)
					setIsOpen(false)
				}
				break
			case 'Escape':
				setIsOpen(false)
				inputRef.current?.blur()
				break
		}
	}

	// Highlight matching text
	const highlightMatch = (text: string, query: string) => {
		if (!query) return text
		const regex = new RegExp(`(${query})`, 'gi')
		const parts = text.split(regex)
		return parts.map((part, i) =>
			regex.test(part) ? (
				<mark key={i} className="bg-warning bg-opacity-50 px-0 rounded">{part}</mark>
			) : (
				part
			)
		)
	}

	const isDark = variant === 'dark'
	const showDropdown = isOpen && (query.length >= 2 || recentSearches.length > 0)

	return (
		<div className={`search-autocomplete position-relative ${className}`}>
			<div className="position-relative">
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={handleInputChange}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder || t('searchPlaceholder')}
					className="form-control"
					style={{
						paddingLeft: '44px',
						paddingRight: '40px',
						height: '50px',
						borderRadius: '12px',
						fontSize: '15px',
						background: isDark ? 'rgba(255,255,255,0.1)' : 'white',
						color: isDark ? 'white' : '#1e293b',
						border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e2e8f0'
					}}
				/>
				{/* Search icon */}
				<svg
					className="position-absolute"
					style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}
					width={20}
					height={20}
					viewBox="0 0 24 24"
					fill="none"
					stroke={isDark ? 'white' : '#64748b'}
					strokeWidth="2"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				{/* Loading spinner or clear button */}
				{loading ? (
					<div
						className="spinner-border spinner-border-sm position-absolute"
						style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }}
					/>
				) : query && (
					<button
						onClick={() => {
							setQuery('')
							setResults([])
							inputRef.current?.focus()
						}}
						className="btn btn-link p-0 position-absolute"
						style={{ right: '14px', top: '50%', transform: 'translateY(-50%)' }}
					>
						<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={isDark ? 'white' : '#64748b'} strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				)}
			</div>

			{/* Dropdown */}
			{showDropdown && (
				<div
					ref={dropdownRef}
					className="search-dropdown"
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						right: 0,
						marginTop: '8px',
						background: 'white',
						borderRadius: '12px',
						boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
						zIndex: 1050,
						maxHeight: '400px',
						overflowY: 'auto'
					}}
				>
					{/* Recent searches (when no query) */}
					{query.length < 2 && recentSearches.length > 0 && (
						<div className="p-3">
							<div className="d-flex justify-content-between align-items-center mb-2">
								<span className="text-muted small fw-medium">Buscas recentes</span>
								<button
									onClick={clearRecentSearches}
									className="btn btn-link btn-sm p-0 text-muted"
									style={{ fontSize: '12px' }}
								>
									Limpar
								</button>
							</div>
							{recentSearches.map((search, index) => (
								<button
									key={index}
									onClick={() => handleRecentClick(search)}
									className="d-flex align-items-center gap-2 w-100 text-start p-2 rounded border-0 bg-transparent"
									style={{
										transition: 'background 0.2s'
									}}
									onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
									onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
								>
									<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12,6 12,12 16,14" />
									</svg>
									<span className="text-dark">{search}</span>
								</button>
							))}
						</div>
					)}

					{/* Search results */}
					{query.length >= 2 && (
						<>
							{results.length > 0 ? (
								<div className="py-2">
									{results.map((vehicle, index) => (
										<button
											key={vehicle._id}
											onClick={() => handleSelect(vehicle)}
											className={`d-flex align-items-center gap-3 w-100 text-start px-3 py-2 border-0 ${
												selectedIndex === index ? 'bg-primary bg-opacity-10' : 'bg-transparent'
											}`}
											style={{ transition: 'background 0.2s' }}
											onMouseEnter={(e) => {
												setSelectedIndex(index)
												e.currentTarget.style.background = '#f1f5f9'
											}}
											onMouseLeave={(e) => {
												if (selectedIndex !== index) {
													e.currentTarget.style.background = 'transparent'
												}
											}}
										>
											{/* Vehicle image */}
											<img
												src={vehicle.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
												alt={vehicle.name}
												style={{
													width: '60px',
													height: '45px',
													objectFit: 'cover',
													borderRadius: '8px'
												}}
											/>
											{/* Vehicle info */}
											<div className="flex-grow-1 min-width-0">
												<div className="fw-medium text-dark" style={{ fontSize: '14px' }}>
													{highlightMatch(vehicle.name, query)}
												</div>
												<div className="text-muted" style={{ fontSize: '12px' }}>
													{highlightMatch(`${vehicle.brand} ${vehicle.model}`, query)} • {vehicle.carType}
												</div>
											</div>
											{/* Price */}
											{vehicle.pricing && (
												<div className="text-primary fw-bold" style={{ fontSize: '14px' }}>
													${vehicle.pricing.dailyRate}
													<span className="text-muted fw-normal" style={{ fontSize: '11px' }}>/dia</span>
												</div>
											)}
										</button>
									))}
									{/* View all results link */}
									<div className="px-3 pt-2 pb-1 border-top mt-2">
										<Link
											href={`/cars-list-1?search=${encodeURIComponent(query)}`}
											className="d-flex align-items-center justify-content-center gap-2 text-primary text-decoration-none py-2"
											onClick={() => {
												saveRecentSearch(query)
												setIsOpen(false)
											}}
										>
											<span>Ver todos os resultados</span>
											<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M5 12h14M12 5l7 7-7 7" />
											</svg>
										</Link>
									</div>
								</div>
							) : !loading ? (
								<div className="text-center py-5">
									<svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mb-3">
										<circle cx="11" cy="11" r="8" />
										<line x1="21" y1="21" x2="16.65" y2="16.65" />
									</svg>
									<p className="text-muted mb-2">Nenhum veículo encontrado</p>
									<p className="text-muted small mb-0">Tente buscar por marca, modelo ou tipo</p>
								</div>
							) : null}
						</>
					)}
				</div>
			)}
		</div>
	)
}
