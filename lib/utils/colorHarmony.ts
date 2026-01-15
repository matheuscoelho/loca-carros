/**
 * Utilitários para geração de paletas harmônicas de cores
 */

// Converte HEX para HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (!result) return { h: 0, s: 0, l: 0 }

	let r = parseInt(result[1], 16) / 255
	let g = parseInt(result[2], 16) / 255
	let b = parseInt(result[3], 16) / 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6
				break
			case g:
				h = ((b - r) / d + 2) / 6
				break
			case b:
				h = ((r - g) / d + 4) / 6
				break
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100)
	}
}

// Converte HSL para HEX
export function hslToHex(h: number, s: number, l: number): string {
	s /= 100
	l /= 100

	const c = (1 - Math.abs(2 * l - 1)) * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = l - c / 2
	let r = 0
	let g = 0
	let b = 0

	if (0 <= h && h < 60) {
		r = c; g = x; b = 0
	} else if (60 <= h && h < 120) {
		r = x; g = c; b = 0
	} else if (120 <= h && h < 180) {
		r = 0; g = c; b = x
	} else if (180 <= h && h < 240) {
		r = 0; g = x; b = c
	} else if (240 <= h && h < 300) {
		r = x; g = 0; b = c
	} else if (300 <= h && h < 360) {
		r = c; g = 0; b = x
	}

	const toHex = (n: number) => {
		const hex = Math.round((n + m) * 255).toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Gera cor complementar (oposta no círculo cromático)
export function getComplementary(hex: string): string {
	const hsl = hexToHsl(hex)
	return hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
}

// Gera cores análogas (adjacentes no círculo cromático)
export function getAnalogous(hex: string): string[] {
	const hsl = hexToHsl(hex)
	return [
		hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l), // -30°
		hex,
		hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)   // +30°
	]
}

// Gera cores triádicas (120° de distância)
export function getTriadic(hex: string): string[] {
	const hsl = hexToHsl(hex)
	return [
		hex,
		hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
		hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
	]
}

// Gera cores split-complementary
export function getSplitComplementary(hex: string): string[] {
	const hsl = hexToHsl(hex)
	return [
		hex,
		hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
		hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
	]
}

// Gera variações de luminosidade (tons mais claros e escuros)
export function getLightnessVariations(hex: string): string[] {
	const hsl = hexToHsl(hex)
	const variations: string[] = []

	// 5 variações de luminosidade
	for (let i = 20; i <= 80; i += 15) {
		variations.push(hslToHex(hsl.h, hsl.s, i))
	}

	return variations
}

// Gera variações de saturação
export function getSaturationVariations(hex: string): string[] {
	const hsl = hexToHsl(hex)
	const variations: string[] = []

	for (let i = 20; i <= 100; i += 20) {
		variations.push(hslToHex(hsl.h, i, hsl.l))
	}

	return variations
}

// Cores pré-definidas populares
export const popularColors = {
	reds: ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5'],
	oranges: ['#f97316', '#ea580c', '#c2410c', '#fb923c', '#fdba74'],
	yellows: ['#eab308', '#ca8a04', '#a16207', '#facc15', '#fde047'],
	greens: ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac'],
	blues: ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd'],
	purples: ['#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#c4b5fd'],
	pinks: ['#ec4899', '#db2777', '#be185d', '#f472b6', '#f9a8d4'],
	grays: ['#6b7280', '#4b5563', '#374151', '#9ca3af', '#d1d5db']
}

// Cores sugeridas para UI
export const uiColors = {
	primary: ['#2563eb', '#3b82f6', '#8b5cf6', '#06b6d4', '#14b8a6'],
	secondary: ['#64748b', '#6b7280', '#78716c', '#737373', '#525252'],
	accent: ['#f59e0b', '#fbbf24', '#f472b6', '#a855f7', '#22d3ee'],
	success: ['#22c55e', '#16a34a', '#10b981', '#34d399', '#4ade80'],
	warning: ['#eab308', '#f59e0b', '#fbbf24', '#facc15', '#fcd34d'],
	danger: ['#ef4444', '#dc2626', '#f87171', '#fb7185', '#f43f5e'],
	backgrounds: ['#ffffff', '#f8fafc', '#f1f5f9', '#0f172a', '#1e293b'],
	texts: ['#0f172a', '#1e293b', '#334155', '#f1f5f9', '#e2e8f0']
}

// Interface para paleta harmônica
export interface ColorPalette {
	name: string
	nameEn: string
	colors: string[]
}

// Gera todas as paletas harmônicas para uma cor
export function generateHarmonicPalettes(hex: string): ColorPalette[] {
	return [
		{
			name: 'Complementar',
			nameEn: 'Complementary',
			colors: [hex, getComplementary(hex)]
		},
		{
			name: 'Análoga',
			nameEn: 'Analogous',
			colors: getAnalogous(hex)
		},
		{
			name: 'Triádica',
			nameEn: 'Triadic',
			colors: getTriadic(hex)
		},
		{
			name: 'Split-Complementar',
			nameEn: 'Split-Complementary',
			colors: getSplitComplementary(hex)
		},
		{
			name: 'Variações de Tom',
			nameEn: 'Shade Variations',
			colors: getLightnessVariations(hex)
		}
	]
}
