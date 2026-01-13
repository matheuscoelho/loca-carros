# Deploy do Carento em VPS com Docker

## Requisitos na VPS

- Docker 20.10+
- Docker Compose 2.0+
- Git
- Mínimo 1GB RAM

## Instalação do Docker (Ubuntu/Debian)

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

## Deploy

### 1. Clonar/Copiar o projeto

```bash
cd /opt
git clone <seu-repositorio> carento
cd carento
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Preencha as variáveis:
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://seudominio.com
NEXTAUTH_SECRET=gerar-chave-secreta-32-chars
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Executar deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

Ou manualmente:
```bash
docker-compose build
docker-compose up -d
```

## Comandos úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Reiniciar
docker-compose restart

# Parar
docker-compose down

# Reconstruir (após mudanças no código)
docker-compose build --no-cache && docker-compose up -d

# Ver status
docker-compose ps

# Entrar no container
docker-compose exec carento sh
```

## Nginx Reverse Proxy (Opcional)

Se quiser usar Nginx como proxy reverso:

```nginx
# /etc/nginx/sites-available/carento
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:3050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar site:
```bash
sudo ln -s /etc/nginx/sites-available/carento /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL com Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com
```

## Troubleshooting

### Container não inicia
```bash
docker-compose logs carento
```

### Verificar se a porta está ocupada
```bash
sudo lsof -i :3050
```

### Limpar imagens antigas
```bash
docker system prune -a
```

### Verificar uso de recursos
```bash
docker stats
```
