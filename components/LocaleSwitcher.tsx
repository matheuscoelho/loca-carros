'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Locale, locales } from '@/i18n/config'

const localeNames: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT'
}

const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  pt: '🇧🇷'
}

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = async (newLocale: Locale) => {
    if (newLocale === locale) return

    // Salvar preferência no cookie via API
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale })
    })

    // Recarregar a página completamente para aplicar o novo idioma
    // router.refresh() não funciona porque o next-intl precisa de um full reload
    window.location.reload()
  }

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm dropdown-toggle d-flex align-items-center gap-1"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={isPending}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit'
        }}
      >
        <span>{localeFlags[locale]}</span>
        <span>{localeNames[locale]}</span>
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {locales.map((loc) => (
          <li key={loc}>
            <button
              className={`dropdown-item d-flex align-items-center gap-2 ${loc === locale ? 'active' : ''}`}
              onClick={() => handleChange(loc)}
              disabled={isPending}
            >
              <span>{localeFlags[loc]}</span>
              <span>{loc === 'en' ? 'English' : 'Português'}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
