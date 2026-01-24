export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { defaultSettings } from '@/models/Settings'
import { resolveTenantFromRequest } from '@/lib/tenant/resolver'

// GET - Obter configurações públicas (branding)
// Esta rota é pública e não requer autenticação
export async function GET(request: NextRequest) {
  try {
    // Resolve tenant from request headers
    const tenantContext = await resolveTenantFromRequest(request)

    if (!tenantContext.tenantId) {
      // Tenant não encontrado - retornar 404
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      )
    }

    const db = await getDatabase()
    const tenantObjectId = new ObjectId(tenantContext.tenantId)

    const settings = await db.collection('settings').findOne({ tenantId: tenantObjectId })

    // Usar settings do banco ou valores padrão
    const branding = settings?.branding || defaultSettings.branding
    const general = settings?.general || defaultSettings.general
    const socialMedia = settings?.socialMedia || defaultSettings.socialMedia

    // Retornar apenas dados públicos (branding, social media e informações de contato)
    return NextResponse.json({
      branding: {
        logoLight: branding.logoLight,
        logoDark: branding.logoDark,
        logoWidth: branding.logoWidth || defaultSettings.branding.logoWidth,
        logoHeight: branding.logoHeight || defaultSettings.branding.logoHeight,
        favicon: branding.favicon,
        siteName: branding.siteName,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor || defaultSettings.branding.accentColor,
        successColor: branding.successColor || defaultSettings.branding.successColor,
        warningColor: branding.warningColor || defaultSettings.branding.warningColor,
        dangerColor: branding.dangerColor || defaultSettings.branding.dangerColor,
        backgroundColor: branding.backgroundColor || defaultSettings.branding.backgroundColor,
        textColor: branding.textColor || defaultSettings.branding.textColor,
        // Cores de texto inteligentes
        textOnDark: branding.textOnDark || defaultSettings.branding.textOnDark,
        textOnLight: branding.textOnLight || defaultSettings.branding.textOnLight,
        textMuted: branding.textMuted || defaultSettings.branding.textMuted,
      },
      socialMedia: {
        instagram: socialMedia.instagram || '',
        facebook: socialMedia.facebook || '',
        twitter: socialMedia.twitter || '',
        youtube: socialMedia.youtube || '',
        linkedin: socialMedia.linkedin || '',
        whatsapp: socialMedia.whatsapp || '',
      },
      general: {
        siteName: branding.siteName,
        siteTitle: general.siteTitle || defaultSettings.general.siteTitle,
        siteDescription: general.siteDescription,
        contactEmail: general.contactEmail,
        contactPhone: general.contactPhone,
        whatsappNumber: general.whatsappNumber || defaultSettings.general.whatsappNumber,
        address: general.address || '',
        city: general.city || '',
        state: general.state || '',
        zipCode: general.zipCode || '',
        showDemoBanner: general.showDemoBanner ?? defaultSettings.general.showDemoBanner,
      },
    }, {
      headers: {
        // Cache por 5 minutos
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Erro ao buscar configurações públicas:', error)

    // Retornar erro interno
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
