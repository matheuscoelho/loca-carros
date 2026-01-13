# Carento

## O que é?

Carento é uma plataforma completa de aluguel de veículos. O sistema permite que clientes encontrem, comparem e aluguem carros de forma simples e segura, enquanto administradores gerenciam toda a operação através de um painel intuitivo.

## Para quem é?

- **Locadoras de veículos** que precisam de um sistema moderno para gerenciar sua frota e reservas
- **Clientes** que buscam uma experiência fácil para alugar carros

## O que o sistema faz?

### Para o Cliente

**Encontrar o carro ideal**
- Navegar pelo catálogo de veículos disponíveis
- Filtrar por tipo (SUV, sedan, hatch), preço, transmissão e combustível
- Ver fotos, especificações e avaliações de outros clientes
- Salvar veículos favoritos para comparar depois

**Fazer uma reserva**
- Escolher datas de retirada e devolução
- Selecionar local de pickup
- Adicionar extras (GPS, cadeirinha, motorista adicional, seguro)
- Ver o preço calculado em tempo real
- Pagar com cartão de crédito de forma segura (Stripe)

**Acompanhar suas reservas**
- Ver histórico completo de aluguéis
- Acompanhar status de cada reserva
- Receber notificações sobre pagamentos e confirmações
- Gerenciar seu perfil

### Para o Administrador

**Gerenciar a frota**
- Cadastrar novos veículos com fotos e especificações
- Definir preços (diária, semanal, depósito)
- Controlar disponibilidade e status (ativo, manutenção, inativo)

**Gerenciar reservas**
- Ver todas as reservas do sistema
- Alterar status (pendente, confirmada, em andamento, concluída, cancelada)
- Filtrar e buscar por cliente, veículo ou período

**Gerenciar pagamentos**
- Acompanhar todos os pagamentos recebidos
- Processar reembolsos quando necessário
- Ver relatórios de receita

**Gerenciar usuários**
- Ver todos os clientes cadastrados
- Promover usuários a administradores
- Ativar ou desativar contas

**Moderar avaliações**
- Aprovar ou rejeitar reviews de clientes
- Responder avaliações

**Ver relatórios**
- Receita total e por período
- Veículos mais alugados
- Estatísticas de reservas

## Idiomas

O sistema suporta **Português** e **Inglês**. O cliente pode trocar o idioma a qualquer momento pelo menu.

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| Next.js 14 | Framework web |
| TypeScript | Linguagem de programação |
| MongoDB | Banco de dados |
| NextAuth.js | Sistema de login |
| Stripe | Processamento de pagamentos |
| Docker | Deploy em servidores |

## Como rodar?

### Desenvolvimento local

```bash
npm install
cp .env.example .env
# Configurar as variáveis no .env
npm run dev
```

### Produção (Docker)

```bash
cp .env.example .env
# Configurar as variáveis no .env
./deploy.sh
```

## Configuração necessária

O sistema precisa de:

1. **MongoDB Atlas** - Banco de dados na nuvem (gratuito)
2. **Stripe** - Conta para processar pagamentos
3. **Servidor/VPS** - Para hospedar a aplicação (com Docker)

## Documentação técnica

- [SISTEMA_TELAS_FLUXOS.md](./SISTEMA_TELAS_FLUXOS.md) - Todas as telas e funcionalidades
- [README_DEPLOY.md](./README_DEPLOY.md) - Guia de deploy em VPS

## Estrutura de pastas

```
app/           → Páginas e rotas da aplicação
  admin/       → Painel administrativo
  api/         → APIs do sistema
  booking/     → Fluxo de reserva
  dashboard/   → Área do cliente
components/    → Componentes reutilizáveis
lib/           → Configurações e serviços
messages/      → Traduções (pt.json, en.json)
models/        → Modelos do banco de dados
public/        → Imagens e arquivos estáticos
```
