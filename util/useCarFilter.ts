'use client'
import { ChangeEvent, useState } from "react"

// Interface para carros do MongoDB
export interface MongoDBCar {
	_id: string
	name: string
	brand: string
	model: string
	year: number
	licensePlate: string
	carType: string
	fuelType: string
	transmission: string
	specs: {
		seats: number
		doors: number
		bags: number
		mileage: number
	}
	pricing: {
		dailyRate: number
		weeklyRate?: number
		deposit: number
		currency: string
	}
	extras: Array<{
		name: string
		price: number
	}>
	amenities: string[]
	images: Array<{
		url: string
		isPrimary: boolean
	}>
	location: {
		city: string
		state: string
		country: string
	}
	availability: {
		isAvailable: boolean
		unavailableDates: Date[]
	}
	rating: number
	reviewCount: number
	totalBookings: number
	status: string
	createdAt: Date
	updatedAt: Date
}

// Interface legada para compatibilidade com JSON antigo
interface LegacyCar {
	id: number
	price: number
	carType: string
	amenities: string
	rating: number
	name: string
	fuelType: string
	location: string
	image: string
}

// Tipo que aceita ambas estruturas
type Car = MongoDBCar | LegacyCar

export interface Filter {
	names: string[]
	fuelType: string[]
	amenities: string[]
	locations: string[]
	priceRange: [number, number]
	ratings: number[]
	carType: string[]
}

type SortCriteria = "name" | "price" | "rating"

// Funções auxiliares para extrair dados de ambas estruturas
const getPrice = (car: Car): number => {
	if ('pricing' in car && car.pricing) {
		return car.pricing.dailyRate
	}
	return (car as LegacyCar).price || 0
}

const getLocation = (car: Car): string => {
	if ('location' in car && typeof car.location === 'object' && car.location !== null) {
		const loc = car.location as { city?: string; state?: string; country?: string }
		return loc.city || ''
	}
	return (car as LegacyCar).location || ''
}

const getAmenities = (car: Car): string[] => {
	if ('amenities' in car && Array.isArray(car.amenities)) {
		return car.amenities
	}
	const legacyAmenity = (car as LegacyCar).amenities
	return legacyAmenity ? [legacyAmenity] : []
}

const getRating = (car: Car): number => {
	return car.rating || 0
}

const useCarFilter = (carsData: Car[]) => {
	const [filter, setFilter] = useState<Filter>({
		names: [],
		fuelType: [],
		amenities: [],
		locations: [],
		priceRange: [0, 1000],
		ratings: [],
		carType: [],
	})
	const [sortCriteria, setSortCriteria] = useState<SortCriteria>("name")
	const [itemsPerPage, setItemsPerPage] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const uniqueNames = [...new Set(carsData.map((car) => car.name))]
	const uniqueFuelTypes = [...new Set(carsData.map((car) => car.fuelType))]

	// Achatar amenities para criar lista única
	const uniqueAmenities = [...new Set(carsData.flatMap((car) => getAmenities(car)))]
	const uniqueLocations = [...new Set(carsData.map((car) => getLocation(car)).filter(Boolean))]
	const uniqueRatings = [...new Set(carsData.map((car) => getRating(car)))]
	const uniqueCarTypes = [...new Set(carsData.map((car) => car.carType))]

	const filteredCars = carsData.filter((car) => {
		const carPrice = getPrice(car)
		const carLocation = getLocation(car)
		const carAmenities = getAmenities(car)
		const carRating = getRating(car)

		return (
			(filter.names.length === 0 || filter.names.includes(car.name)) &&
			(filter.fuelType.length === 0 || filter.fuelType.includes(car.fuelType)) &&
			(filter.amenities.length === 0 || filter.amenities.some(a => carAmenities.includes(a))) &&
			(filter.locations.length === 0 || filter.locations.includes(carLocation)) &&
			(carPrice >= filter.priceRange[0] && carPrice <= filter.priceRange[1]) &&
			(filter.ratings.length === 0 || filter.ratings.includes(carRating)) &&
			(filter.carType.length === 0 || filter.carType.includes(car.carType))
		)
	})

	const sortedCars = [...filteredCars].sort((a, b) => {
		if (sortCriteria === "name") {
			return a.name.localeCompare(b.name)
		} else if (sortCriteria === "price") {
			return getPrice(a) - getPrice(b)
		} else if (sortCriteria === "rating") {
			return getRating(b) - getRating(a)
		}
		return 0
	})

	const totalPages = Math.ceil(sortedCars.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedCars = sortedCars.slice(startIndex, endIndex)

	const handleCheckboxChange = (field: keyof Filter, value: string | number) => (e: ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked
		setFilter((prevFilter) => {
			const values = prevFilter[field] as (string | number)[]
			if (checked) {
				return { ...prevFilter, [field]: [...values, value] }
			} else {
				return {
					...prevFilter,
					[field]: values.filter((item) => item !== value),
				}
			}
		})
	}

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortCriteria(e.target.value as SortCriteria)
	}

	const handlePriceRangeChange = (values: [number, number]) => {
		setFilter((prevFilter) => ({
			...prevFilter,
			priceRange: values,
		}))
	}

	const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setItemsPerPage(Number(e.target.value))
		setCurrentPage(1)
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1)
		}
	}

	const handleClearFilters = () => {
		setFilter({
			names: [],
			fuelType: [],
			amenities: [],
			locations: [],
			priceRange: [0, 1000],
			ratings: [],
			carType: [],
		})
		setSortCriteria("name")
		setItemsPerPage(4)
		setCurrentPage(1)
	}

	const startItemIndex = (currentPage - 1) * itemsPerPage + 1
	const endItemIndex = Math.min(startItemIndex + itemsPerPage - 1, sortedCars.length)

	return {
		filter,
		setFilter,
		sortCriteria,
		setSortCriteria,
		itemsPerPage,
		setItemsPerPage,
		currentPage,
		setCurrentPage,
		uniqueNames,
		uniqueFuelTypes,
		uniqueAmenities,
		uniqueLocations,
		uniqueRatings,
		uniqueCarTypes,
		filteredCars,
		sortedCars,
		totalPages,
		startIndex,
		endIndex,
		paginatedCars,
		handleCheckboxChange,
		handleSortChange,
		handlePriceRangeChange,
		handleItemsPerPageChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		handleClearFilters,
		startItemIndex,
		endItemIndex,
	}
}

export default useCarFilter
