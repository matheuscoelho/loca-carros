# Sistema Carento - Telas e Fluxos

## Sumário

1. [Área Pública](#1-área-pública)
2. [Autenticação](#2-autenticação)
3. [Dashboard do Cliente](#3-dashboard-do-cliente)
4. [Fluxo de Reserva](#4-fluxo-de-reserva)
5. [Área Administrativa](#5-área-administrativa)
6. [Fluxos Completos](#6-fluxos-completos)

---

## 1. Área Pública

### 1.1. Página Inicial (Home)
- **Rota:** `/`
- **Descrição:** Landing page com banner principal, busca de veículos, categorias e destaques
- **Elementos:**
  - Header com navegação principal
  - Banner hero com formulário de busca
  - Seção de categorias de veículos
  - Veículos em destaque
  - Seção de benefícios
  - Footer com links e informações

### 1.2. Listagem de Veículos
- **Rota:** `/cars-list-1`
- **Descrição:** Catálogo completo de veículos disponíveis para aluguel
- **Elementos:**
  - Filtros laterais (tipo, preço, transmissão, combustível)
  - Grid de cards de veículos
  - Ordenação (preço, popularidade)
  - Paginação
- **Ações:**
  - Filtrar veículos
  - Visualizar detalhes
  - Adicionar aos favoritos (requer login)

### 1.3. Detalhes do Veículo
- **Rota:** `/cars-details-1/[id]`
- **Descrição:** Página completa com informações do veículo
- **Elementos:**
  - Galeria de imagens
  - Especificações técnicas (assentos, portas, bagagens)
  - Preço diário e depósito
  - Amenidades disponíveis
  - Localização
  - Avaliações de clientes
  - Botão "Reservar Agora"
- **Ações:**
  - Ver todas as fotos
  - Ler avaliações
  - Iniciar reserva
  - Adicionar aos favoritos

### 1.4. Página de Contato
- **Rota:** `/contact`
- **Descrição:** Formulário de contato e informações da empresa
- **Elementos:**
  - Formulário de contato
  - Mapa de localização
  - Informações de contato (telefone, email, endereço)
  - Horário de funcionamento

### 1.5. Páginas Institucionais
- **Rotas:** `/about`, `/faq`, `/terms`, `/privacy`
- **Descrição:** Páginas de informações sobre a empresa

---

## 2. Autenticação

### 2.1. Página de Login
- **Rota:** `/login`
- **Descrição:** Formulário de autenticação de usuários
- **Elementos:**
  - Campo de email
  - Campo de senha
  - Botão "Entrar"
  - Link "Esqueci minha senha"
  - Link "Criar conta"
  - Opções de login social (Google - opcional)
- **Validações:**
  - Email válido
  - Senha obrigatória
- **Redirecionamentos:**
  - Sucesso: Dashboard ou página anterior (callbackUrl)
  - Erro: Mensagem de credenciais inválidas

### 2.2. Página de Registro
- **Rota:** `/register`
- **Descrição:** Formulário de criação de nova conta
- **Elementos:**
  - Campo nome completo
  - Campo email
  - Campo senha
  - Campo confirmar senha
  - Checkbox de termos de uso
  - Botão "Criar Conta"
  - Link "Já tenho conta"
- **Validações:**
  - Nome obrigatório (mín. 2 caracteres)
  - Email válido e único
  - Senha (mín. 6 caracteres)
  - Senhas devem coincidir
- **Redirecionamentos:**
  - Sucesso: Página de login com mensagem de sucesso
  - Erro: Mensagem específica (email já existe, etc.)

### 2.3. Recuperação de Senha
- **Rota:** `/forgot-password`
- **Descrição:** Formulário para solicitar redefinição de senha
- **Elementos:**
  - Campo de email
  - Botão "Enviar link"
  - Link "Voltar ao login"

---

## 3. Dashboard do Cliente

### 3.1. Visão Geral (Dashboard Home)
- **Rota:** `/dashboard`
- **Descrição:** Painel principal do cliente com resumo das atividades
- **Elementos:**
  - Cards de estatísticas:
    - Total de reservas
    - Reservas ativas
    - Veículos favoritos
    - Notificações não lidas
  - Lista de reservas recentes
  - Próximas reservas
  - Atalhos rápidos
- **Ações:**
  - Ver todas as reservas
  - Ver detalhes de reserva
  - Acessar favoritos

### 3.2. Minhas Reservas
- **Rota:** `/dashboard/my-rentals`
- **Descrição:** Lista completa de todas as reservas do cliente
- **Elementos:**
  - Filtros por status (todas, ativas, concluídas, canceladas)
  - Lista de reservas com:
    - Número da reserva
    - Veículo (imagem e nome)
    - Datas (retirada e devolução)
    - Status (pendente, confirmada, em andamento, concluída, cancelada)
    - Valor total
    - Botão de ações
- **Ações:**
  - Ver detalhes da reserva
  - Cancelar reserva (se pendente/confirmada)
  - Avaliar veículo (se concluída)

### 3.3. Detalhes da Reserva
- **Rota:** `/dashboard/my-rentals/[id]`
- **Descrição:** Informações completas de uma reserva específica
- **Elementos:**
  - Status da reserva (destacado)
  - Informações do veículo
  - Datas e locais de retirada/devolução
  - Informações do motorista
  - Extras contratados
  - Resumo de pagamento
  - Histórico de status
- **Ações:**
  - Cancelar reserva
  - Baixar comprovante
  - Contatar suporte

### 3.4. Meus Pagamentos
- **Rota:** `/dashboard/my-payments`
- **Descrição:** Histórico de transações financeiras
- **Elementos:**
  - Lista de pagamentos com:
    - ID da transação
    - Data
    - Reserva relacionada
    - Valor
    - Status (pago, pendente, reembolsado)
    - Método de pagamento
- **Ações:**
  - Ver detalhes do pagamento
  - Baixar recibo/nota fiscal

### 3.5. Favoritos
- **Rota:** `/dashboard/favorites`
- **Descrição:** Lista de veículos salvos pelo cliente
- **Elementos:**
  - Grid de veículos favoritos
  - Card com imagem, nome, preço
  - Botão remover dos favoritos
  - Botão reservar
- **Ações:**
  - Remover dos favoritos
  - Ver detalhes do veículo
  - Iniciar reserva

### 3.6. Notificações
- **Rota:** `/dashboard/notifications`
- **Descrição:** Central de notificações do sistema
- **Elementos:**
  - Lista de notificações com:
    - Ícone do tipo
    - Título
    - Mensagem
    - Data/hora
    - Status (lida/não lida)
  - Filtros (todas, não lidas)
  - Botão marcar todas como lidas
- **Tipos de notificação:**
  - Reserva confirmada
  - Pagamento recebido
  - Lembrete de retirada
  - Reserva concluída
  - Promoções

### 3.7. Meu Perfil
- **Rota:** `/dashboard/profile`
- **Descrição:** Gerenciamento de dados pessoais
- **Elementos:**
  - Foto de perfil (upload)
  - Formulário de dados pessoais:
    - Nome completo
    - Email (somente leitura)
    - Telefone
    - Data de nascimento
  - Formulário de endereço:
    - CEP, Rua, Número, Complemento
    - Bairro, Cidade, Estado, País
  - Formulário de CNH:
    - Número da CNH
    - Data de validade
    - Status de verificação
  - Seção de segurança:
    - Alterar senha
- **Ações:**
  - Atualizar dados
  - Upload de foto
  - Alterar senha

---

## 4. Fluxo de Reserva

### 4.1. Página de Reserva
- **Rota:** `/booking/[carId]`
- **Descrição:** Formulário completo para criar uma reserva
- **Elementos:**
  - Sidebar com informações do veículo:
    - Imagem
    - Nome e modelo
    - Especificações
    - Preço diário
    - Depósito
  - Formulário de reserva:
    - Data de retirada (date picker)
    - Data de devolução (date picker)
    - Local de retirada
    - Checkbox "Devolver no mesmo local"
    - Local de devolução (se diferente)
  - Seção de extras opcionais:
    - GPS Navigation (+$10/dia)
    - Child Seat (+$15/dia)
    - Additional Driver (+$20/dia)
  - Informações do motorista:
    - Nome completo
    - Email
    - Telefone
  - Resumo do pedido:
    - Duração (dias)
    - Subtotal
    - Extras
    - Desconto (se aplicável)
    - Impostos (10%)
    - **Total**
  - Botão "Checkout"
- **Validações:**
  - Datas obrigatórias
  - Data de devolução > data de retirada
  - Local de retirada obrigatório
  - Nome e email do motorista obrigatórios
- **Cálculo automático:**
  - Atualiza em tempo real ao mudar datas ou extras
  - Desconto para reservas longas (7+ dias: 10%, 30+ dias: 20%)

### 4.2. Página de Checkout (Pagamento)
- **Rota:** `/booking/checkout?bookingId=[id]`
- **Descrição:** Página de pagamento com Stripe
- **Elementos:**
  - Formulário de pagamento (Stripe Elements):
    - Número do cartão
    - Data de validade (MM/AA)
    - Código de segurança (CVC)
    - País
  - Resumo da reserva:
    - Imagem do veículo
    - Nome do veículo
    - Número da reserva
    - Datas de pickup/return
    - Duração
    - Subtotal
    - Taxa
    - **Total**
  - Botão "Pagar $XXX.XX"
  - Indicador de segurança
- **Ações:**
  - Processar pagamento
  - Voltar para editar reserva
- **Integrações:**
  - Stripe Payment Intent
  - Webhook para confirmação

### 4.3. Página de Confirmação
- **Rota:** `/booking/confirmation?bookingId=[id]`
- **Descrição:** Confirmação da reserva realizada
- **Elementos:**
  - Ícone de status (sucesso ou pendente)
  - Título "Booking Confirmed" ou "Booking Pending"
  - Mensagem de status
  - Detalhes da reserva:
    - Número da reserva
    - Veículo reservado
    - Status do veículo
    - Data/local de retirada
    - Data/local de devolução
  - Informações do motorista
  - Resumo do pagamento:
    - Duração
    - Valor diário x dias
    - Extras
    - Taxa
    - **Total**
    - Status do pagamento
  - Botões de ação:
    - "Ver Minhas Reservas"
    - "Buscar Mais Carros"
- **Status possíveis:**
  - Booking Confirmed (pagamento aprovado)
  - Booking Pending (aguardando confirmação de pagamento)

---

## 5. Área Administrativa

### 5.1. Dashboard Admin
- **Rota:** `/admin`
- **Descrição:** Painel principal com métricas e visão geral do sistema
- **Acesso:** Somente usuários com role "admin"
- **Elementos:**
  - Cards de estatísticas:
    - Receita Total
    - Total de Reservas
    - Veículos Ativos
    - Total de Usuários
  - Gráfico de reservas por status
  - Tabela de reservas recentes
- **Menu lateral:**
  - Dashboard
  - Veículos
  - Reservas
  - Usuários
  - Pagamentos
  - Avaliações
  - Relatórios
  - Configurações
  - Voltar ao Site

### 5.2. Gestão de Veículos

#### 5.2.1. Lista de Veículos
- **Rota:** `/admin/vehicles`
- **Descrição:** Gerenciamento do catálogo de veículos
- **Elementos:**
  - Cards de estatísticas:
    - Total de veículos
    - Ativos
    - Em manutenção
    - Inativos
  - Barra de busca
  - Filtros por tipo e status
  - Tabela de veículos:
    - Imagem
    - Nome/Modelo
    - Tipo
    - Placa
    - Preço diário
    - Status (dropdown editável)
    - Rating
    - Total de reservas
    - Ações (Editar, Excluir)
  - Botão "Adicionar Veículo"
- **Ações:**
  - Buscar veículos
  - Filtrar por tipo/status
  - Alterar status inline
  - Editar veículo
  - Excluir veículo
  - Adicionar novo veículo

#### 5.2.2. Adicionar Veículo
- **Rota:** `/admin/vehicles/new`
- **Descrição:** Formulário para cadastrar novo veículo
- **Elementos:**
  - Informações básicas:
    - Nome do veículo
    - Placa
    - Marca
    - Modelo
    - Ano
    - Tipo (Sedan, SUV, Hatchback, etc.)
    - Combustível (Gasolina, Diesel, Elétrico, Híbrido)
    - Transmissão (Automático, Manual)
  - Especificações:
    - Assentos
    - Portas
    - Bagagens
    - Quilometragem
  - Amenidades:
    - Lista de amenidades com add/remove
  - Localização:
    - Cidade
    - Estado
    - País
  - Preços:
    - Diária
    - Semanal
    - Depósito
  - Imagem:
    - URL da imagem principal
    - Preview da imagem
  - Status:
    - Ativo
    - Inativo
    - Manutenção
  - Botão "Salvar"
- **Validações:**
  - Campos obrigatórios: nome, placa, marca, modelo, ano, preço diário

#### 5.2.3. Editar Veículo
- **Rota:** `/admin/vehicles/[id]/edit`
- **Descrição:** Formulário de edição de veículo existente
- **Elementos:** Mesmo do formulário de adicionar, preenchido com dados existentes
- **Ações:**
  - Atualizar dados
  - Cancelar e voltar

### 5.3. Gestão de Reservas
- **Rota:** `/admin/bookings`
- **Descrição:** Gerenciamento de todas as reservas do sistema
- **Elementos:**
  - Cards de status (clicáveis para filtrar):
    - Pending (amarelo)
    - Confirmed (azul)
    - In Progress (azul escuro)
    - Completed (verde)
    - Cancelled (vermelho)
  - Barra de busca (número, nome, email)
  - Filtro por status
  - Tabela de reservas:
    - Booking # / Data de criação
    - Customer (nome/email)
    - Vehicle
    - Dates (pickup, return, duração)
    - Amount
    - Status (dropdown editável)
    - Payment status (badge)
    - Ações (Visualizar)
- **Ações:**
  - Buscar reservas
  - Filtrar por status
  - Alterar status da reserva inline
  - Ver detalhes da reserva

### 5.4. Gestão de Usuários
- **Rota:** `/admin/users`
- **Descrição:** Gerenciamento de usuários do sistema
- **Elementos:**
  - Cards de estatísticas:
    - Total de usuários
    - Ativos
    - Admins
    - Clientes
  - Barra de busca (nome, email)
  - Filtro por role
  - Tabela de usuários:
    - Avatar/Iniciais
    - Nome
    - Email
    - Telefone
    - Role (dropdown: Cliente, Admin)
    - Status (dropdown: Active, Inactive, Suspended)
    - Último login
    - Total de reservas
    - Data de registro
    - Ações (Visualizar)
- **Ações:**
  - Buscar usuários
  - Filtrar por role
  - Alterar role inline
  - Alterar status inline
  - Ver detalhes do usuário

### 5.5. Outras Páginas Admin (Estrutura)

#### 5.5.1. Pagamentos
- **Rota:** `/admin/payments`
- **Descrição:** Lista de transações financeiras

#### 5.5.2. Avaliações
- **Rota:** `/admin/reviews`
- **Descrição:** Moderação de avaliações de clientes

#### 5.5.3. Relatórios
- **Rota:** `/admin/reports`
- **Descrição:** Relatórios e analytics do sistema

#### 5.5.4. Configurações
- **Rota:** `/admin/settings`
- **Descrição:** Configurações gerais do sistema

---

## 6. Fluxos Completos

### 6.1. Fluxo de Registro e Login

```
1. Usuário acessa /register
2. Preenche formulário de registro
3. Sistema valida dados e cria conta
4. Redireciona para /login com mensagem de sucesso
5. Usuário faz login com credenciais
6. Sistema autentica e cria sessão
7. Redireciona para /dashboard
```

### 6.2. Fluxo de Reserva Completa

```
1. Usuário navega pelo catálogo (/cars-list-1)
2. Seleciona um veículo (/cars-details-1/[id])
3. Clica em "Reservar Agora"
4. Sistema verifica autenticação
   - Se não logado: redireciona para /login com callback
   - Se logado: continua
5. Acessa página de booking (/booking/[carId])
6. Preenche datas, local e informações do motorista
7. Sistema calcula preço em tempo real
8. Usuário clica em "Checkout"
9. Sistema cria reserva com status "pending"
10. Redireciona para checkout (/booking/checkout)
11. Usuário preenche dados do cartão (Stripe)
12. Clica em "Pagar"
13. Stripe processa pagamento
14. Sistema atualiza status da reserva
15. Redireciona para confirmação (/booking/confirmation)
16. Reserva aparece em /dashboard/my-rentals
```

### 6.3. Fluxo de Gestão Admin

```
1. Admin faz login
2. Sistema verifica role = "admin"
3. Acessa /admin (dashboard)
4. Visualiza métricas gerais
5. Navega para seção específica:
   - /admin/vehicles - Gerenciar frota
   - /admin/bookings - Gerenciar reservas
   - /admin/users - Gerenciar usuários
6. Realiza ações de CRUD conforme necessário
7. Alterações são refletidas em tempo real
```

### 6.4. Fluxo de Cancelamento de Reserva

```
1. Cliente acessa /dashboard/my-rentals
2. Localiza reserva com status "pending" ou "confirmed"
3. Clica em "Cancelar"
4. Sistema exibe modal de confirmação
5. Usuário confirma cancelamento
6. Sistema atualiza status para "cancelled"
7. Se pago, inicia processo de reembolso
8. Notificação enviada ao cliente
```

---

## Anexo: APIs do Sistema

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Veículos
- `GET /api/cars` - Listar veículos
- `GET /api/cars/[id]` - Detalhes do veículo
- `POST /api/cars` - Criar veículo (admin)
- `PUT /api/cars/[id]` - Atualizar veículo (admin)
- `DELETE /api/cars/[id]` - Excluir veículo (admin)
- `GET /api/cars/[id]/availability` - Verificar disponibilidade

### Reservas
- `GET /api/bookings` - Listar reservas
- `POST /api/bookings` - Criar reserva
- `GET /api/bookings/[id]` - Detalhes da reserva
- `PUT /api/bookings/[id]` - Atualizar reserva
- `POST /api/bookings/calculate` - Calcular preço

### Pagamentos
- `POST /api/payments/create-intent` - Criar Payment Intent
- `POST /api/payments/webhook` - Webhook Stripe

### Admin
- `GET /api/admin/dashboard` - Métricas do dashboard
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/users/[id]` - Detalhes do usuário
- `PUT /api/admin/users/[id]` - Atualizar usuário
- `DELETE /api/admin/users/[id]` - Excluir usuário

---

## Anexo: Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| Next.js 14 | Framework React com App Router |
| TypeScript | Tipagem estática |
| MongoDB | Banco de dados |
| NextAuth.js | Autenticação |
| Stripe | Processamento de pagamentos |
| next-intl | Internacionalização (PT/EN) |
| Bootstrap 5 | Framework CSS |
| SWR | Fetching e cache de dados |

---

*Documento gerado em: Janeiro 2026*
*Versão: 1.0*
