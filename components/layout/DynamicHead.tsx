'use client'

import { useEffect } from 'react'
import { useBranding } from '@/contexts/BrandingContext'

export default function DynamicHead() {
	const { branding, general, isLoading } = useBranding()

	useEffect(() => {
		if (isLoading) return

		// Update document title
		if (general.siteTitle) {
			document.title = general.siteTitle
		}

		// Update meta description
		let metaDescription = document.querySelector('meta[name="description"]')
		if (!metaDescription) {
			metaDescription = document.createElement('meta')
			metaDescription.setAttribute('name', 'description')
			document.head.appendChild(metaDescription)
		}
		metaDescription.setAttribute('content', general.siteDescription || '')

		// Update favicon
		if (branding.favicon) {
			let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
			if (!link) {
				link = document.createElement('link')
				link.rel = 'icon'
				document.head.appendChild(link)
			}
			link.href = branding.favicon
		}

		// Update Open Graph meta tags
		const updateOgMeta = (property: string, content: string) => {
			let meta = document.querySelector(`meta[property="${property}"]`)
			if (!meta) {
				meta = document.createElement('meta')
				meta.setAttribute('property', property)
				document.head.appendChild(meta)
			}
			meta.setAttribute('content', content)
		}

		updateOgMeta('og:title', general.siteTitle || branding.siteName)
		updateOgMeta('og:description', general.siteDescription || '')
		updateOgMeta('og:site_name', branding.siteName)

		// Update Twitter meta tags
		const updateTwitterMeta = (name: string, content: string) => {
			let meta = document.querySelector(`meta[name="${name}"]`)
			if (!meta) {
				meta = document.createElement('meta')
				meta.setAttribute('name', name)
				document.head.appendChild(meta)
			}
			meta.setAttribute('content', content)
		}

		updateTwitterMeta('twitter:title', general.siteTitle || branding.siteName)
		updateTwitterMeta('twitter:description', general.siteDescription || '')

	}, [branding, general, isLoading])

	return null
}
