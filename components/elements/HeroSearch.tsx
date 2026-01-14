'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslations } from 'next-intl'

export default function HeroSearch() {
	const router = useRouter()
	const t = useTranslations('heroSearch')

	const [locations, setLocations] = useState<string[]>([])
	const [pickupLocation, setPickupLocation] = useState<string>('')
	const [dropoffLocation, setDropoffLocation] = useState<string>('')
	const [pickupDate, setPickupDate] = useState<Date | null>(new Date())
	const [returnDate, setReturnDate] = useState<Date | null>(() => {
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		return tomorrow
	})
	const [sameLocation, setSameLocation] = useState(true)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchLocations()
	}, [])

	useEffect(() => {
		if (sameLocation && pickupLocation) {
			setDropoffLocation(pickupLocation)
		}
	}, [sameLocation, pickupLocation])

	const fetchLocations = async () => {
		try {
			const response = await fetch('/api/cars/locations')
			const data = await response.json()
			if (data.locations && data.locations.length > 0) {
				setLocations(data.locations)
				setPickupLocation(data.locations[0])
				setDropoffLocation(data.locations[0])
			}
		} catch (error) {
			console.error('Error fetching locations:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = () => {
		const params = new URLSearchParams()

		if (pickupLocation) {
			params.set('city', pickupLocation)
		}
		if (pickupDate) {
			params.set('pickupDate', pickupDate.toISOString())
		}
		if (returnDate) {
			params.set('returnDate', returnDate.toISOString())
		}

		router.push(`/cars-list-1?${params.toString()}`)
	}

	return (
		<>
			<div className="box-bottom-search background-card hero-search-container">
				{/* Local de Retirada */}
				<div className="item-search">
					<label className="text-sm-bold neutral-500">{t('pickupLocation')}</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle
							as="div"
							className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search"
							style={{ cursor: 'pointer' }}
						>
							{loading ? t('loading') : (pickupLocation || t('selectLocation'))}
						</Dropdown.Toggle>
						<Dropdown.Menu as="ul" className="dropdown-menu">
							{locations.map((location) => (
								<li key={location}>
									<button
										className="dropdown-item"
										onClick={() => setPickupLocation(location)}
									>
										{location}
									</button>
								</li>
							))}
							{locations.length === 0 && !loading && (
								<li>
									<span className="dropdown-item text-muted">{t('noLocations')}</span>
								</li>
							)}
						</Dropdown.Menu>
					</Dropdown>
				</div>

				{/* Local de Devolução - com checkbox em position absolute */}
				<div className="item-search item-search-2" style={{ position: 'relative' }}>
					<label className="text-sm-bold neutral-500">{t('dropoffLocation')}</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle
							as="div"
							className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search"
							style={{
								cursor: sameLocation ? 'not-allowed' : 'pointer',
								opacity: sameLocation ? 0.6 : 1
							}}
						>
							{loading ? t('loading') : (dropoffLocation || t('selectLocation'))}
						</Dropdown.Toggle>
						{!sameLocation && (
							<Dropdown.Menu as="ul" className="dropdown-menu">
								{locations.map((location) => (
									<li key={location}>
										<button
											className="dropdown-item"
											onClick={() => setDropoffLocation(location)}
										>
											{location}
										</button>
									</li>
								))}
							</Dropdown.Menu>
						)}
					</Dropdown>
					{/* Checkbox em position absolute - não afeta altura */}
					<div className="same-location-check">
						<input
							type="checkbox"
							className="form-check-input"
							id="sameLocationCheck"
							checked={sameLocation}
							onChange={(e) => setSameLocation(e.target.checked)}
						/>
						<label
							className="form-check-label text-xs neutral-500"
							htmlFor="sameLocationCheck"
						>
							{t('sameLocation')}
						</label>
					</div>
				</div>

				{/* Data de Retirada */}
				<div className="item-search item-search-3">
					<label className="text-sm-bold neutral-500">{t('pickupDateTime')}</label>
					<div className="box-calendar-date">
						<DatePicker
							selected={pickupDate}
							onChange={(date) => setPickupDate(date)}
							minDate={new Date()}
							dateFormat="dd/MM/yyyy"
							className="form-control search-date-input"
							placeholderText={t('selectDate')}
						/>
					</div>
				</div>

				{/* Data de Devolução */}
				<div className="item-search bd-none">
					<label className="text-sm-bold neutral-500">{t('returnDateTime')}</label>
					<div className="box-calendar-date">
						<DatePicker
							selected={returnDate}
							onChange={(date) => setReturnDate(date)}
							minDate={pickupDate || new Date()}
							dateFormat="dd/MM/yyyy"
							className="form-control search-date-input"
							placeholderText={t('selectDate')}
						/>
					</div>
				</div>

				{/* Botão de Busca */}
				<div className="item-search bd-none d-flex justify-content-end">
					<button
						className="btn btn-brand-2 text-nowrap"
						onClick={handleSearch}
						disabled={!pickupLocation || !pickupDate || !returnDate}
					>
						<svg className="me-2" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{t('findVehicle')}
					</button>
				</div>
			</div>
			<style jsx global>{`
				.hero-search-container {
					padding-bottom: 35px !important;
				}
				.same-location-check {
					position: absolute;
					bottom: -22px;
					left: 27px;
					white-space: nowrap;
					display: flex;
					align-items: center;
					gap: 6px;
				}
				.same-location-check .form-check-input {
					margin: 0;
					cursor: pointer;
				}
				.same-location-check .form-check-label {
					cursor: pointer;
					user-select: none;
				}
				.search-date-input {
					border: none !important;
					background: transparent !important;
					padding: 0 !important;
					font-size: 14px;
					color: #101010;
					cursor: pointer;
					width: 100%;
				}
				.search-date-input:focus {
					outline: none !important;
					box-shadow: none !important;
				}
				.react-datepicker-wrapper {
					width: 100%;
				}
				.react-datepicker__input-container {
					width: 100%;
				}
				@media (max-width: 991px) {
					.same-location-check {
						bottom: -18px;
						left: 27px;
					}
				}
				@media (max-width: 575px) {
					.hero-search-container {
						padding-bottom: 25px !important;
					}
					.same-location-check {
						position: relative;
						bottom: auto;
						left: auto;
						margin-top: 8px;
					}
				}
			`}</style>
		</>
	)
}
