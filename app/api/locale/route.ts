import { NextRequest, NextResponse } from 'next/server'
import { locales, Locale } from '@/i18n/config'

export async function POST(request: NextRequest) {
  const { locale } = await request.json()

  if (!locales.includes(locale as Locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const response = NextResponse.json({ success: true, locale })

  // Definir cookie que expira em 1 ano
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return response
}

export async function GET() {
  return NextResponse.json({ locales, default: 'en' })
}
