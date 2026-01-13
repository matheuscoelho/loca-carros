# ===== STAGE 1: Dependencies =====
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# ===== STAGE 2: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Variáveis públicas do Next.js (recebidas via build args)
ARG NEXT_PUBLIC_SHOW_DEMO_BANNER
ENV NEXT_PUBLIC_SHOW_DEMO_BANNER=${NEXT_PUBLIC_SHOW_DEMO_BANNER}

# Build da aplicação
RUN npm run build

# ===== STAGE 3: Runner =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Trocar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3050

ENV PORT=3050
ENV HOSTNAME="0.0.0.0"

# Comando de inicialização
CMD ["node", "server.js"]
