'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { Locale, locales } from '@/i18n/config'
import Dropdown from 'react-bootstrap/Dropdown'

const localeNames: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT'
}

const localeFullNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português'
}

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale
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
    window.location.reload()
  }

  return (
    <Dropdown className="head-lang">
      <Dropdown.Toggle
        as="span"
        className="text-14-medium icon-lang"
        style={{ cursor: isPending ? 'wait' : 'pointer' }}
      >
        <span className="arrow-down">{localeNames[locale]}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-account" style={{ visibility: 'visible' }}>
        <ul>
          {locales.map((loc) => (
            <li key={loc}>
              <button
                className={`text-sm-medium bg-transparent border-0 w-100 text-start ${loc === locale ? 'text-primary' : ''}`}
                onClick={() => handleChange(loc)}
                disabled={isPending}
                style={{ cursor: 'pointer' }}
              >
                {localeFullNames[loc]}
              </button>
            </li>
          ))}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  )
}
