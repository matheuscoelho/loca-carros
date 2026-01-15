export interface ThemePreset {
	id: string
	name: string
	nameEn: string
	description: string
	descriptionEn: string
	primaryColor: string
	secondaryColor: string
	accentColor: string
	successColor: string
	warningColor: string
	dangerColor: string
	backgroundColor: string
	textColor: string
}

export const themePresets: ThemePreset[] = [
	{
		id: 'professional',
		name: 'Profissional',
		nameEn: 'Professional',
		description: 'Cores corporativas e elegantes',
		descriptionEn: 'Corporate and elegant colors',
		primaryColor: '#2563eb',
		secondaryColor: '#64748b',
		accentColor: '#f59e0b',
		successColor: '#22c55e',
		warningColor: '#eab308',
		dangerColor: '#ef4444',
		backgroundColor: '#ffffff',
		textColor: '#1e293b'
	},
	{
		id: 'modern',
		name: 'Moderno',
		nameEn: 'Modern',
		description: 'Vibrante e contemporâneo',
		descriptionEn: 'Vibrant and contemporary',
		primaryColor: '#8b5cf6',
		secondaryColor: '#06b6d4',
		accentColor: '#f472b6',
		successColor: '#34d399',
		warningColor: '#fbbf24',
		dangerColor: '#f87171',
		backgroundColor: '#fafafa',
		textColor: '#18181b'
	},
	{
		id: 'dark',
		name: 'Dark Mode',
		nameEn: 'Dark Mode',
		description: 'Tema escuro elegante',
		descriptionEn: 'Elegant dark theme',
		primaryColor: '#22d3ee',
		secondaryColor: '#a78bfa',
		accentColor: '#fbbf24',
		successColor: '#4ade80',
		warningColor: '#facc15',
		dangerColor: '#fb7185',
		backgroundColor: '#0f172a',
		textColor: '#f1f5f9'
	},
	{
		id: 'nature',
		name: 'Natureza',
		nameEn: 'Nature',
		description: 'Tons verdes e orgânicos',
		descriptionEn: 'Green and organic tones',
		primaryColor: '#16a34a',
		secondaryColor: '#65a30d',
		accentColor: '#ca8a04',
		successColor: '#22c55e',
		warningColor: '#eab308',
		dangerColor: '#dc2626',
		backgroundColor: '#f0fdf4',
		textColor: '#14532d'
	},
	{
		id: 'luxury',
		name: 'Luxo',
		nameEn: 'Luxury',
		description: 'Dourado e sofisticado',
		descriptionEn: 'Golden and sophisticated',
		primaryColor: '#b45309',
		secondaryColor: '#78716c',
		accentColor: '#fcd34d',
		successColor: '#059669',
		warningColor: '#d97706',
		dangerColor: '#be123c',
		backgroundColor: '#1c1917',
		textColor: '#fafaf9'
	},
	{
		id: 'ocean',
		name: 'Oceano',
		nameEn: 'Ocean',
		description: 'Tons azuis e refrescantes',
		descriptionEn: 'Blue and refreshing tones',
		primaryColor: '#0284c7',
		secondaryColor: '#0891b2',
		accentColor: '#14b8a6',
		successColor: '#10b981',
		warningColor: '#f59e0b',
		dangerColor: '#ef4444',
		backgroundColor: '#f0f9ff',
		textColor: '#0c4a6e'
	},
	{
		id: 'sunset',
		name: 'Pôr do Sol',
		nameEn: 'Sunset',
		description: 'Tons quentes e acolhedores',
		descriptionEn: 'Warm and welcoming tones',
		primaryColor: '#ea580c',
		secondaryColor: '#dc2626',
		accentColor: '#facc15',
		successColor: '#22c55e',
		warningColor: '#f59e0b',
		dangerColor: '#be123c',
		backgroundColor: '#fff7ed',
		textColor: '#7c2d12'
	},
	{
		id: 'minimal',
		name: 'Minimalista',
		nameEn: 'Minimal',
		description: 'Clean e neutro',
		descriptionEn: 'Clean and neutral',
		primaryColor: '#171717',
		secondaryColor: '#525252',
		accentColor: '#737373',
		successColor: '#22c55e',
		warningColor: '#eab308',
		dangerColor: '#ef4444',
		backgroundColor: '#fafafa',
		textColor: '#171717'
	}
]

export function getPresetById(id: string): ThemePreset | undefined {
	return themePresets.find(preset => preset.id === id)
}
