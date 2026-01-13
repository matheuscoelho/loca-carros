#!/bin/bash

# ===========================================
# Script de Deploy - Navegar Sistemas
# ===========================================

set -e

echo "🚀 Iniciando deploy do Navegar Sistemas..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado. Por favor, instale o Docker Compose.${NC}"
    exit 1
fi

# Verificar arquivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado.${NC}"
    echo -e "${YELLOW}   Copiando .env.example para .env...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ Por favor, edite o arquivo .env com suas credenciais e execute novamente.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Verificações concluídas${NC}"

# Parar containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker-compose down 2>/dev/null || true

# Build da imagem
echo -e "${YELLOW}🔨 Construindo imagem Docker...${NC}"
docker-compose build --no-cache

# Iniciar containers
echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker-compose up -d

# Aguardar inicialização
echo -e "${YELLOW}⏳ Aguardando inicialização...${NC}"
sleep 10

# Verificar status
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    echo -e "${GREEN}   Acesse: http://localhost:3050${NC}"
    echo ""
    echo -e "${YELLOW}📋 Comandos úteis:${NC}"
    echo "   - Ver logs:     docker-compose logs -f"
    echo "   - Parar:        docker-compose down"
    echo "   - Reiniciar:    docker-compose restart"
    echo "   - Status:       docker-compose ps"
else
    echo -e "${RED}❌ Erro no deploy. Verifique os logs:${NC}"
    docker-compose logs
    exit 1
fi
