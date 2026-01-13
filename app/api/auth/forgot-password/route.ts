import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { sendPasswordResetEmail } from '@/lib/services/email'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

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

		// Find user by email
		const user = await usersCollection.findOne({ email: email.toLowerCase() })

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

		// Send email
		try {
			await sendPasswordResetEmail(email, resetToken)
		} catch (emailError) {
			console.error('Error sending password reset email:', emailError)
			// Don't expose email sending errors to the user
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
