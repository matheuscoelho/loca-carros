import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { sendPasswordResetEmail } from '@/lib/services/email'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import { ITenant } from '@/models/Tenant'

export const dynamic = 'force-dynamic'

/**
 * Resolve o tenantId a partir do hostname da requisição
 */
async function resolveTenantId(hostname: string): Promise<string | null> {
	if (!hostname) return null

	const db = await getDatabase()
	const baseDomain = process.env.BASE_DOMAIN || 'localhost'
	const cleanHostname = hostname.split(':')[0].toLowerCase()

	let tenantSlug: string | null = null
	if (cleanHostname.endsWith(`.${baseDomain}`)) {
		tenantSlug = cleanHostname.replace(`.${baseDomain}`, '')
	}

	const tenant = await db.collection<ITenant>('tenants').findOne({
		$or: [
			{ 'domains.primary': cleanHostname },
			{ 'domains.custom': cleanHostname },
			...(tenantSlug ? [{ slug: tenantSlug }] : []),
		],
		status: 'active',
	})

	return tenant?._id?.toString() || null
}

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json(
				{ error: 'Email é obrigatório' },
				{ status: 400 }
			)
		}

		const db = await getDatabase()
		const usersCollection = db.collection('users')

		// Resolver tenant a partir do hostname
		const host = request.headers.get('host')!
		const tenantId = await resolveTenantId(host)

		// Buscar usuário pelo email E tenant
		const query: Record<string, unknown> = {
			email: email.toLowerCase(),
			role: { $ne: 'super_admin' },
		}

		if (tenantId) {
			query.tenantId = new ObjectId(tenantId)
		}

		const user = await usersCollection.findOne(query)

		// Always return success to prevent email enumeration
		if (!user) {
			return NextResponse.json({ message: 'Se o email estiver cadastrado, você receberá um link de recuperação' })
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString('hex')
		const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
		const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

		// Save token to database
		await usersCollection.updateOne(
			{ _id: user._id },
			{
				$set: {
					resetToken: resetTokenHash,
					resetTokenExpiry,
				}
			}
		)

		// Montar URL do tenant
		const protocol = request.headers.get('x-forwarded-proto') || 'https'
		const baseUrl = `${protocol}://${host}`

		// Send email
		console.log('[forgot-password] Enviando email para:', email, 'tenant:', tenantId, 'baseUrl:', baseUrl)
		try {
			await sendPasswordResetEmail(email, resetToken, baseUrl)
			console.log('[forgot-password] Email enviado com sucesso')
		} catch (emailError) {
			console.log('[forgot-password] ERRO ao enviar email:', emailError)
		}

		return NextResponse.json({ message: 'Se o email estiver cadastrado, você receberá um link de recuperação' })

	} catch (error) {
		console.error('Error in forgot-password:', error)
		return NextResponse.json(
			{ error: 'Erro ao processar solicitação' },
			{ status: 500 }
		)
	}
}
