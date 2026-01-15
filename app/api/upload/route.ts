import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Tipos de arquivo permitidos por categoria
const ALLOWED_TYPES: Record<string, string[]> = {
  logo: ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'],
  favicon: ['image/x-icon', 'image/png', 'image/svg+xml'],
  general: ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'],
}

// Limites de tamanho por categoria (em bytes)
const SIZE_LIMITS: Record<string, number> = {
  logo: 5 * 1024 * 1024, // 5MB
  favicon: 2 * 1024 * 1024, // 2MB
  general: 10 * 1024 * 1024, // 10MB
}

// Diretório base de uploads
const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Obter formdata
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as string) || 'general'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = ALLOWED_TYPES[category] || ALLOWED_TYPES.general
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar tamanho
    const sizeLimit = SIZE_LIMITS[category] || SIZE_LIMITS.general
    if (file.size > sizeLimit) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: ${sizeLimit / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Criar diretório se não existir
    const categoryDir = path.join(UPLOADS_DIR, category)
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`
    const filePath = path.join(categoryDir, fileName)

    // Converter para buffer e salvar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Retornar URL do arquivo (usando a API de servir uploads)
    const fileUrl = `/api/uploads/${category}/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao processar upload' },
      { status: 500 }
    )
  }
}

// DELETE - Remover arquivo
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json(
        { error: 'Caminho do arquivo não fornecido' },
        { status: 400 }
      )
    }

    // Validar que o caminho está dentro do diretório de uploads
    const fullPath = path.join(process.cwd(), filePath)
    if (!fullPath.startsWith(UPLOADS_DIR)) {
      return NextResponse.json(
        { error: 'Caminho inválido' },
        { status: 400 }
      )
    }

    // Remover arquivo
    const fs = await import('fs/promises')
    await fs.unlink(fullPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar arquivo' },
      { status: 500 }
    )
  }
}
