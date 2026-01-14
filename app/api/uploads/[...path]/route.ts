import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Mapeamento de extensão para content-type
const CONTENT_TYPES: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const filePath = pathSegments.join('/')
    const fullPath = path.join(process.cwd(), 'uploads', filePath)

    // Verificar se o arquivo existe
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Validar que o caminho está dentro do diretório de uploads
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fullPath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { error: 'Caminho inválido' },
        { status: 400 }
      )
    }

    // Ler arquivo
    const fileBuffer = await readFile(fullPath)

    // Determinar content-type
    const ext = path.extname(fullPath).toLowerCase()
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'

    // Retornar arquivo com headers apropriados
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Erro ao servir arquivo:', error)
    return NextResponse.json(
      { error: 'Erro ao servir arquivo' },
      { status: 500 }
    )
  }
}
