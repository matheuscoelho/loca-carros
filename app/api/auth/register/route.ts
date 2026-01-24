export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { registerSchema } from '@/lib/validations/auth'
import { IUser } from '@/types'
import { resolveTenantFromRequest } from '@/lib/tenant/resolver'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Resolve tenant from request
    const tenantContext = await resolveTenantFromRequest(request)
    if (!tenantContext.tenantId) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      )
    }

    const tenantObjectId = new ObjectId(tenantContext.tenantId)

    // Validar dados
    const validatedData = registerSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, phone } = validatedData.data

    const db = await getDatabase()

    // Verificar se email já existe no mesmo tenant
    const existingUser = await db.collection('users').findOne({
      email: email.toLowerCase(),
      tenantId: tenantObjectId,
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    // Criar usuário com tenantId
    const newUser: Omit<IUser, '_id'> = {
      tenantId: tenantObjectId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone: phone || undefined,
      role: 'cliente',
      emailVerified: false,
      favorites: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('users').insertOne(newUser)

    return NextResponse.json(
      {
        message: 'Cadastro realizado com sucesso!',
        data: {
          id: result.insertedId.toString(),
          email: newUser.email,
          name: newUser.name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
