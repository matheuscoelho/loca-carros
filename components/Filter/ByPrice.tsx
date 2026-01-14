export default function ByPrice({ handlePriceRangeChange, filter }: any) {
	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newMin = parseInt(e.target.value)
		// Garante que min não ultrapasse max
		if (newMin <= filter.priceRange[1]) {
			handlePriceRangeChange([newMin, filter.priceRange[1]])
		}
	}

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newMax = parseInt(e.target.value)
		// Garante que max não seja menor que min
		if (newMax >= filter.priceRange[0]) {
			handlePriceRangeChange([filter.priceRange[0], newMax])
		}
	}

	return (
		<>
			<div className="box-collapse scrollFilter">
				<div className="mb-2">
					<label className="text-xs-medium neutral-500 d-block mb-1">Mínimo</label>
					<input
						type="range"
						min="0"
						max="1000"
						value={filter.priceRange[0]}
						onChange={handleMinChange}
						className="w-100"
					/>
				</div>
				<div className="mb-2">
					<label className="text-xs-medium neutral-500 d-block mb-1">Máximo</label>
					<input
						type="range"
						min="0"
						max="1000"
						value={filter.priceRange[1]}
						onChange={handleMaxChange}
						className="w-100"
					/>
				</div>
				<div className="text-center">
					<span className="text-sm-bold">${filter.priceRange[0]}</span>
					<span className="text-sm-medium neutral-500"> - </span>
					<span className="text-sm-bold">${filter.priceRange[1]}</span>
				</div>
			</div>
		</>
	)
}
