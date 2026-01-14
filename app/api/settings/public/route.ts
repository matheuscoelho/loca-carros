export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { defaultSettings } from '@/models/Settings'

// GET - Obter configurações públicas (branding)
// Esta rota é pública e não requer autenticação
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const settings = await db.collection('settings').findOne({})

    // Usar settings do banco ou valores padrão
    const branding = settings?.branding || defaultSettings.branding
    const general = settings?.general || defaultSettings.general

    // Retornar apenas dados públicos (branding e nome do site)
    return NextResponse.json({
      branding: {
        logoLight: branding.logoLight,
        logoDark: branding.logoDark,
        favicon: branding.favicon,
        siteName: branding.siteName,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
      },
      general: {
        siteName: branding.siteName,
        siteDescription: general.siteDescription,
        contactEmail: general.contactEmail,
        contactPhone: general.contactPhone,
      },
    }, {
      headers: {
        // Cache por 5 minutos
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Erro ao buscar configurações públicas:', error)

    // Retornar valores padrão em caso de erro
    return NextResponse.json({
      branding: {
        logoLight: defaultSettings.branding.logoLight,
        logoDark: defaultSettings.branding.logoDark,
        favicon: defaultSettings.branding.favicon,
        siteName: defaultSettings.branding.siteName,
        primaryColor: defaultSettings.branding.primaryColor,
        secondaryColor: defaultSettings.branding.secondaryColor,
      },
      general: {
        siteName: defaultSettings.branding.siteName,
        siteDescription: defaultSettings.general.siteDescription,
        contactEmail: defaultSettings.general.contactEmail,
        contactPhone: defaultSettings.general.contactPhone,
      },
    })
  }
}
