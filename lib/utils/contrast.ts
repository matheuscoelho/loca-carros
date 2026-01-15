/**
 * Utilitários para cálculo de contraste de cores conforme WCAG 2.1
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

interface RGB {
	r: number
	g: number
	b: number
}

/**
 * Converte cor hexadecimal para RGB
 */
export function hexToRgb(hex: string): RGB {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (!result) {
		return { r: 0, g: 0, b: 0 }
	}
	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	}
}

/**
 * Calcula a luminância relativa de uma cor
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(hex: string): number {
	const rgb = hexToRgb(hex)
	const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
		v /= 255
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
	})
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calcula o ratio de contraste entre duas cores
 * https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
	const l1 = getLuminance(color1)
	const l2 = getLuminance(color2)
	const lighter = Math.max(l1, l2)
	const darker = Math.min(l1, l2)
	return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Níveis de conformidade WCAG
 */
export type WCAGLevel = 'AAA' | 'AA' | 'AA-large' | 'fail'

/**
 * Verifica o nível de conformidade WCAG
 * - AAA: ratio >= 7:1 (recomendado para texto normal)
 * - AA: ratio >= 4.5:1 (mínimo para texto normal)
 * - AA-large: ratio >= 3:1 (mínimo para texto grande 18pt+ ou 14pt+ bold)
 * - fail: ratio < 3:1 (não passa)
 */
export function getWCAGLevel(ratio: number): WCAGLevel {
	if (ratio >= 7) return 'AAA'
	if (ratio >= 4.5) return 'AA'
	if (ratio >= 3) return 'AA-large'
	return 'fail'
}

/**
 * Retorna informações completas sobre contraste
 */
export interface ContrastInfo {
	ratio: number
	level: WCAGLevel
	passes: boolean
	passesLargeText: boolean
}

export function getContrastInfo(foreground: string, background: string): ContrastInfo {
	const ratio = getContrastRatio(foreground, background)
	const level = getWCAGLevel(ratio)
	return {
		ratio: Math.round(ratio * 100) / 100,
		level,
		passes: ratio >= 4.5,
		passesLargeText: ratio >= 3
	}
}

/**
 * Sugere uma cor mais escura ou mais clara para melhorar contraste
 */
export function suggestBetterColor(color: string, background: string, targetRatio: number = 4.5): string {
	const bgLuminance = getLuminance(background)
	const colorLuminance = getLuminance(color)

	// Determina se precisamos clarear ou escurecer
	const needsLighter = bgLuminance < 0.5

	const rgb = hexToRgb(color)
	let { r, g, b } = rgb

	// Ajusta até atingir o ratio desejado
	for (let i = 0; i < 100; i++) {
		const currentRatio = getContrastRatio(rgbToHex(r, g, b), background)
		if (currentRatio >= targetRatio) {
			return rgbToHex(r, g, b)
		}

		if (needsLighter) {
			r = Math.min(255, r + 5)
			g = Math.min(255, g + 5)
			b = Math.min(255, b + 5)
		} else {
			r = Math.max(0, r - 5)
			g = Math.max(0, g - 5)
			b = Math.max(0, b - 5)
		}
	}

	return color
}

/**
 * Converte RGB para hexadecimal
 */
export function rgbToHex(r: number, g: number, b: number): string {
	return '#' + [r, g, b].map(x => {
		const hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}).join('')
}

/**
 * Verifica se uma cor é clara ou escura
 */
export function isLightColor(hex: string): boolean {
	return getLuminance(hex) > 0.5
}

/**
 * Retorna a cor de texto recomendada (preto ou branco) para um fundo
 */
export function getRecommendedTextColor(backgroundColor: string): string {
	return isLightColor(backgroundColor) ? '#000000' : '#ffffff'
}
