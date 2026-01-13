import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	try {
		const { token, password } = await request.json()

		if (!token || !password) {
			return NextResponse.json(
				{ error: 'Token e senha são obrigatórios' },
				{ status: 400 }
			)
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Senha deve ter pelo menos 6 caracteres' },
				{ status: 400 }
			)
		}

		const db = await getDatabase()
		const usersCollection = db.collection('users')

		// Hash the token to compare with stored hash
		const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

		// Find user with valid token
		const user = await usersCollection.findOne({
			resetToken: tokenHash,
			resetTokenExpiry: { $gt: new Date() },
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Link de recuperação inválido ou expirado' },
				{ status: 400 }
			)
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(password, 12)

		// Update user password and clear reset token
		await usersCollection.updateOne(
			{ _id: user._id },
			{
				$set: {
					password: hashedPassword,
				},
				$unset: {
					resetToken: '',
					resetTokenExpiry: '',
				}
			}
		)

		return NextResponse.json({ message: 'Senha redefinida com sucesso' })

	} catch (error) {
		console.error('Error in reset-password:', error)
		return NextResponse.json(
			{ error: 'Erro ao redefinir senha' },
			{ status: 500 }
		)
	}
}
