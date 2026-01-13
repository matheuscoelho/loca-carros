# Sistema Carento - Telas e Fluxos

## Sumário

1. [Status Geral](#status-geral)
2. [Área Pública](#1-área-pública)
3. [Autenticação](#2-autenticação)
4. [Dashboard do Cliente](#3-dashboard-do-cliente)
5. [Fluxo de Reserva](#4-fluxo-de-reserva)
6. [Área Administrativa](#5-área-administrativa)
7. [Fluxos Completos](#6-fluxos-completos)
8. [APIs do Sistema](#7-apis-do-sistema)

---

## Status Geral

| Área | Status | Observações |
|------|--------|-------------|
| **Frontend Público** | ✅ 100% | Listagens e detalhes conectados ao MongoDB |
| **Autenticação** | ✅ 100% | Login/Registro funcionais com NextAuth |
| **Dashboard Cliente** | ✅ 100% | Reservas, pagamentos, favoritos, notificações |
| **Fluxo de Reserva** | ✅ 100% | Booking → Checkout → Confirmação |
| **Pagamentos Stripe** | ✅ 100% | Payment Intent + Webhook |
| **Admin** | ✅ 100% | CRUD completo + proteção de rotas |
| **Segurança** | ✅ 100% | Middleware protege rotas admin |
| **i18n** | ✅ 100% | Português e Inglês |

---

## 1. Área Pública

### 1.1. Página Inicial (Home)
- **Rota:** `/`
- **Status:** ✅ Implementada
- **Descrição:** Landing page com banner principal, busca de veículos, categorias e destaques
- **Elementos:**
  - Header com navegação principal
  - Banner hero com formulário de busca
  - Seção "Premium Brands" (marcas)
  - Seção "Most Searched Vehicles" (6 carros da API)
  - Seção "Featured Listings" (4 carros da API)
  - Seção de benefícios e testemunhos
  - Footer com links e informações
- **Integração:** Conectada à API `/api/cars`

### 1.2. Listagem de Veículos
- **Rotas:** `/cars-list-1`, `/cars-list-2`, `/cars-list-3`, `/cars-list-4`
- **Status:** ✅ Implementada
- **Descrição:** Catálogo completo de veículos disponíveis para aluguel
- **Elementos:**
  - Filtros laterais (tipo, preço, transmissão, combustível, rating)
  - Grid de cards de veículos com botão de favorito
  - Ordenação (preço, popularidade)
  - Mapa de localização
  - Contagem de resultados (ex: "1 - 6 of 6 tours found")
- **Ações:**
  - Filtrar veículos
  - Visualizar detalhes
  - Adicionar aos favoritos (requer login)
- **Integração:** Conectada à API `/api/cars`

### 1.3. Detalhes do Veículo
- **Rota:** `/cars/[id]` (dinâmica)
- **Status:** ✅ Implementada
- **Descrição:** Página completa com informações do veículo
- **Elementos:**
  - Galeria de imagens com slider principal
  - Thumbnails clicáveis
  - Especificações técnicas (assentos, portas, bagagens, transmissão)
  - Preço diário destacado
  - Seção "Overview" com descrição
  - Seção "Included in the Price" (itens inclusos)
  - Seção "Q&A" (FAQ accordion)
  - Seção "Reviews" com avaliações de clientes
  - Sidebar com formulário de datas e botão "Rent This Vehicle"
  - Informações do dealer/locadora
  - Botão de favoritar
- **Ações:**
  - Navegar entre fotos
  - Ler avaliações
  - Iniciar reserva
  - Adicionar aos favoritos
- **Integração:** Conectada à API `/api/cars/[id]`

### 1.4. Página de Contato
- **Rota:** `/contact`
- **Status:** ✅ Implementada (template)
- **Elementos:**
  - Formulário de contato
  - Mapa de localização
  - Informações de contato

### 1.5. Páginas Institucionais
- **Rotas:** `/about`, `/faqs`, `/term`, `/services`
- **Status:** ✅ Implementadas (template)

---

## 2. Autenticação

### 2.1. Página de Login
- **Rota:** `/login`
- **Status:** ✅ Implementada
- **Descrição:** Formulário de autenticação de usuários
- **Elementos:**
  - Campo de email
  - Campo de senha
  - Botão "Entrar"
  - Link "Esqueci minha senha"
  - Link "Criar conta"
- **Validações:**
  - Email válido
  - Senha obrigatória
- **Redirecionamentos:**
  - Sucesso: Dashboard ou página anterior (callbackUrl)
  - Erro: Mensagem de credenciais inválidas
- **Integração:** NextAuth.js com JWT

### 2.2. Página de Registro
- **Rota:** `/register`
- **Status:** ✅ Implementada
- **Elementos:**
  - Campo nome completo
  - Campo email
  - Campo senha
  - Campo confirmar senha
  - Botão "Criar Conta"
  - Link "Já tenho conta"
- **Validações:**
  - Nome obrigatório (mín. 2 caracteres)
  - Email válido e único
  - Senha (mín. 6 caracteres)
  - Senhas devem coincidir
- **Integração:** API `/api/auth/register`

---

## 3. Dashboard do Cliente

### 3.1. Visão Geral (Dashboard Home)
- **Rota:** `/dashboard`
- **Status:** ✅ Implementada
- **Descrição:** Painel principal do cliente com resumo das atividades
- **Elementos:**
  - Cards de estatísticas reais:
    - Total de reservas (do usuário)
    - Reservas ativas
    - Veículos favoritos
    - Notificações não lidas
  - Lista de reservas recentes
  - Atalhos rápidos
- **Integração:** APIs `/api/bookings`, `/api/favorites`, `/api/notifications`

### 3.2. Minhas Reservas
- **Rota:** `/dashboard/my-rentals`
- **Status:** ✅ Implementada
- **Descrição:** Lista completa de todas as reservas do cliente
- **Elementos:**
  - Filtros por status (todas, pendentes, confirmadas, em andamento, concluídas, canceladas)
  - Lista de reservas com:
    - Número da reserva
    - Veículo (imagem e nome)
    - Datas (retirada e devolução)
    - Status com badge colorido
    - Valor total
    - Botão "Ver Detalhes"
- **Ações:**
  - Filtrar por status
  - Ver detalhes da reserva
  - Link para checkout se pagamento pendente
- **Integração:** API `/api/bookings` (filtrada por userId)

### 3.3. Meus Pagamentos
- **Rota:** `/dashboard/my-payments`
- **Status:** ✅ Implementada
- **Descrição:** Histórico de transações financeiras
- **Elementos:**
  - Lista de pagamentos baseada nas reservas
  - Cada item mostra:
    - Número da reserva
    - Data
    - Veículo
    - Valor total
    - Status do pagamento (badge)
- **Integração:** API `/api/bookings` (com dados de pagamento)

### 3.4. Favoritos
- **Rota:** `/dashboard/favorites`
- **Status:** ✅ Implementada
- **Descrição:** Lista de veículos salvos pelo cliente
- **Elementos:**
  - Grid de veículos favoritos
  - Card com imagem, nome, especificações, preço
  - Botão remover dos favoritos (coração)
  - Botão "Reservar"
  - Estado vazio com call-to-action
- **Ações:**
  - Remover dos favoritos
  - Ver detalhes do veículo
  - Iniciar reserva
- **Integração:** API `/api/favorites`

### 3.5. Notificações
- **Rota:** `/dashboard/notifications`
- **Status:** ✅ Implementada
- **Descrição:** Central de notificações do sistema
- **Elementos:**
  - Lista de notificações com:
    - Ícone do tipo (pagamento, reserva, sistema)
    - Título
    - Mensagem
    - Data/hora relativa
    - Indicador de lida/não lida
  - Botão "Marcar todas como lidas"
  - Badge de contagem no menu
- **Tipos de notificação:**
  - `payment_received` - Pagamento confirmado
  - `payment_failed` - Pagamento falhou
  - `booking_confirmed` - Reserva confirmada
  - `welcome` - Boas-vindas
- **Integração:** APIs `/api/notifications`, `/api/notifications/mark-read`, `/api/notifications/mark-all-read`

### 3.6. Meu Perfil
- **Rota:** `/dashboard/profile`
- **Status:** ✅ Implementada
- **Descrição:** Gerenciamento de dados pessoais
- **Elementos:**
  - Formulário de dados pessoais:
    - Nome completo
    - Email (somente leitura)
    - Telefone
    - Role (somente leitura)
  - Botão "Editar" / "Salvar"
- **Integração:** API `/api/users/profile`

---

## 4. Fluxo de Reserva

### 4.1. Página de Reserva
- **Rota:** `/booking/[carId]`
- **Status:** ✅ Implementada
- **Descrição:** Formulário completo para criar uma reserva
- **Elementos:**
  - Sidebar com informações do veículo:
    - Imagem do carro
    - Nome e modelo
    - Especificações (assentos, transmissão, combustível)
    - Preço diário
  - Formulário de reserva:
    - Data de retirada (date picker)
    - Data de devolução (date picker)
    - Local de retirada (select)
    - Local de devolução (select)
  - Seção de extras opcionais:
    - GPS Navigation (+$10/dia)
    - Child Seat (+$15/dia)
    - Additional Driver (+$20/dia)
    - Full Insurance (+$25/dia)
  - Informações do motorista:
    - Nome completo
    - Email
    - Telefone
  - Resumo do pedido (atualiza em tempo real):
    - Duração (dias)
    - Subtotal (diária x dias)
    - Extras
    - Taxa (10%)
    - **Total**
  - Botão "Proceed to Checkout"
- **Validações:**
  - Datas obrigatórias
  - Data de devolução > data de retirada
  - Verifica disponibilidade do veículo
- **Integração:** APIs `/api/cars/[id]`, `/api/cars/[id]/availability`, `/api/bookings`

### 4.2. Página de Checkout (Pagamento)
- **Rota:** `/booking/checkout?bookingId=[id]`
- **Status:** ✅ Implementada
- **Descrição:** Página de pagamento com Stripe
- **Elementos:**
  - Resumo da reserva:
    - Imagem do veículo
    - Nome do veículo
    - Número da reserva
    - Datas de pickup/return
    - Duração
    - Subtotal, extras, taxa
    - **Total**
  - Formulário de pagamento (Stripe Elements):
    - Número do cartão
    - Data de validade (MM/AA)
    - Código de segurança (CVC)
  - Botão "Pay $XXX.XX"
  - Indicador de segurança SSL
- **Integração:**
  - API `/api/payments/create-intent` (cria Payment Intent)
  - Stripe.js para processamento
  - Webhook `/api/payments/webhook` para confirmação

### 4.3. Página de Confirmação
- **Rota:** `/booking/confirmation?bookingId=[id]`
- **Status:** ✅ Implementada
- **Descrição:** Confirmação da reserva realizada
- **Elementos:**
  - Ícone de status (check verde ou relógio amarelo)
  - Título "Booking Confirmed!" ou "Booking Pending"
  - Mensagem de status
  - Detalhes da reserva:
    - Número da reserva
    - Veículo reservado
    - Data/local de retirada
    - Data/local de devolução
  - Informações do motorista
  - Resumo do pagamento:
    - Duração e valor
    - Extras (se houver)
    - Taxa
    - **Total**
    - Status do pagamento (Paid/Pending)
  - Botões de ação:
    - "View My Rentals"
    - "Find More Cars"
- **Status possíveis:**
  - `confirmed` + `paid` → "Booking Confirmed!"
  - `pending` + `pending` → "Booking Pending"

---

## 5. Área Administrativa

### 5.1. Proteção de Rotas
- **Status:** ✅ Implementada
- **Middleware:** `middleware.ts`
- **Regras:**
  - Rotas `/admin/*` requerem `role === 'admin'`
  - Usuários não-admin são redirecionados para `/dashboard`
  - Rotas públicas não requerem autenticação

### 5.2. Dashboard Admin
- **Rota:** `/admin`
- **Status:** ✅ Implementada
- **Descrição:** Painel principal com métricas e visão geral do sistema
- **Elementos:**
  - Cards de estatísticas:
    - Receita Total (soma de pagamentos)
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
- **Integração:** API `/api/admin/dashboard`

### 5.3. Gestão de Veículos

#### 5.3.1. Lista de Veículos
- **Rota:** `/admin/vehicles`
- **Status:** ✅ Implementada
- **Elementos:**
  - Cards de estatísticas (total, ativos, manutenção, inativos)
  - Barra de busca
  - Filtros por tipo e status
  - Tabela de veículos com edição inline de status
  - Botão "Adicionar Veículo"
- **Integração:** API `/api/admin/cars`

#### 5.3.2. Adicionar/Editar Veículo
- **Rotas:** `/admin/vehicles/new`, `/admin/vehicles/[id]/edit`
- **Status:** ✅ Implementada
- **Campos:**
  - Informações básicas (nome, placa, marca, modelo, ano)
  - Tipo, combustível, transmissão
  - Especificações (assentos, portas, bagagens)
  - Localização (cidade, estado, país)
  - Preços (diária, semanal, depósito)
  - URL da imagem
  - Status

### 5.4. Gestão de Reservas
- **Rota:** `/admin/bookings`
- **Status:** ✅ Implementada
- **Elementos:**
  - Cards de status clicáveis para filtrar
  - Busca por número, nome ou email
  - Tabela com edição inline de status
  - Visualização de detalhes
- **Integração:** API `/api/admin/bookings`

### 5.5. Gestão de Usuários
- **Rota:** `/admin/users`
- **Status:** ✅ Implementada
- **Elementos:**
  - Cards de estatísticas
  - Busca e filtros
  - Tabela com edição inline de role e status
- **Integração:** API `/api/admin/users`

### 5.6. Gestão de Pagamentos
- **Rota:** `/admin/payments`
- **Status:** ✅ Implementada
- **Descrição:** Visualizar e gerenciar todos os pagamentos do sistema
- **Elementos:**
  - Cards de estatísticas:
    - Total recebido (succeeded)
    - Pendentes (pending)
    - Reembolsados (refunded)
    - Falhos (failed)
  - Busca por transaction ID, nome ou email
  - Filtro por status
  - Tabela com:
    - Transaction ID e Stripe Payment Intent ID
    - Cliente (nome e email)
    - Booking number
    - Valor e moeda
    - Método de pagamento
    - Status com badge
    - Data
    - Botão de reembolso (para succeeded)
- **Ações:**
  - Filtrar por status
  - Processar reembolso
- **Integração:** API `/api/admin/payments`

### 5.7. Gestão de Avaliações
- **Rota:** `/admin/reviews`
- **Status:** ✅ Implementada
- **Descrição:** Moderar avaliações de clientes sobre veículos
- **Elementos:**
  - Cards de estatísticas:
    - Total de reviews
    - Pendentes de aprovação
    - Aprovadas
    - Rating médio (estrelas)
  - Busca por cliente, veículo ou comentário
  - Filtro por status (pending, approved, rejected)
  - Lista de reviews com:
    - Rating (estrelas)
    - Status com badge
    - Título e comentário
    - Cliente e veículo
    - Ratings detalhados (preço, serviço, segurança, conforto, limpeza)
    - Resposta do admin (se houver)
    - Botões: Aprovar, Rejeitar, Responder
  - Modal para responder reviews
- **Ações:**
  - Aprovar review (atualiza rating médio do veículo)
  - Rejeitar review
  - Responder review
- **Integração:** API `/api/admin/reviews`

### 5.8. Relatórios e Analytics
- **Rota:** `/admin/reports`
- **Status:** ✅ Implementada
- **Descrição:** Relatórios e estatísticas do sistema
- **Elementos:**
  - Seletor de período (semana, mês, ano)
  - Cards de receita:
    - Receita total
    - Receita deste mês
    - Receita do mês anterior
    - Crescimento (%)
  - Gráfico de bookings por status (barras de progresso)
  - Tabela de veículos mais alugados:
    - Posição
    - Veículo (marca e modelo)
    - Quantidade de aluguéis
    - Receita gerada
  - Lista de atividade recente
- **Integração:** APIs `/api/admin/dashboard`, `/api/bookings`

### 5.9. Configurações
- **Rota:** `/admin/settings`
- **Status:** ✅ Implementada
- **Descrição:** Configurações gerais do sistema
- **Elementos:**
  - Abas de configuração:
    - **General:** Nome do site, descrição, email, telefone, moeda, timezone
    - **Pricing:** Taxa de imposto, taxa de serviço, taxa de cancelamento, porcentagem de depósito
    - **Notifications:** Ativar/desativar emails de confirmação, pagamento, lembretes
    - **Business Rules:** Dias mín/máx de aluguel, antecedência máxima, horários de pickup
  - Botão "Save Settings"
  - Indicador de sucesso ao salvar
- **Armazenamento:** localStorage (pode ser migrado para MongoDB)

---

## 6. Fluxos Completos

### 6.1. Fluxo de Registro e Login

```
1. Usuário acessa /register
2. Preenche formulário de registro
3. Sistema valida dados e cria conta
4. Sistema cria notificação de boas-vindas
5. Redireciona para /login com mensagem de sucesso
6. Usuário faz login com credenciais
7. Sistema autentica e cria sessão JWT
8. Redireciona para /dashboard
```

### 6.2. Fluxo de Reserva Completa

```
1. Usuário navega pelo catálogo (/cars-list-1)
2. Pode filtrar por tipo, preço, rating
3. Pode favoritar veículos (botão coração)
4. Seleciona um veículo → /cars/[id]
5. Visualiza galeria, especificações, reviews
6. Clica em "Rent This Vehicle"
7. Sistema verifica autenticação
   - Se não logado: redireciona para /login
   - Se logado: continua
8. Acessa página de booking (/booking/[carId])
9. Seleciona datas e verifica disponibilidade
10. Adiciona extras se desejar
11. Preenche dados do motorista
12. Sistema calcula preço em tempo real
13. Clica em "Proceed to Checkout"
14. Sistema cria reserva com status "pending"
15. Redireciona para /booking/checkout
16. Preenche dados do cartão (Stripe)
17. Clica em "Pay"
18. Stripe processa pagamento
19. Webhook atualiza reserva para "confirmed" e pagamento para "paid"
20. Sistema cria notificação de pagamento recebido
21. Redireciona para /booking/confirmation
22. Reserva aparece em /dashboard/my-rentals
```

### 6.3. Fluxo de Gestão Admin

```
1. Admin faz login com credenciais
2. Middleware verifica role = "admin"
3. Acessa /admin (dashboard)
4. Visualiza métricas gerais do sistema
5. Navega para seção específica:
   - /admin/vehicles → Gerenciar frota (CRUD)
   - /admin/bookings → Gerenciar reservas (alterar status)
   - /admin/users → Gerenciar usuários (alterar role/status)
6. Alterações são refletidas imediatamente
7. Não-admins que tentam acessar /admin são redirecionados
```

### 6.4. Fluxo de Favoritos

```
1. Usuário logado navega na listagem
2. Clica no botão coração em um veículo
3. Sistema adiciona à lista de favoritos
4. Coração fica preenchido (vermelho)
5. Usuário acessa /dashboard/favorites
6. Visualiza todos os favoritos
7. Pode remover ou iniciar reserva
```

---

## 7. APIs do Sistema

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/[...nextauth]` | NextAuth endpoints |

### Veículos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/cars` | Listar veículos |
| GET | `/api/cars/[id]` | Detalhes do veículo |
| GET | `/api/cars/[id]/availability` | Verificar disponibilidade |

### Reservas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/bookings` | Listar reservas do usuário |
| POST | `/api/bookings` | Criar reserva |
| GET | `/api/bookings/[id]` | Detalhes da reserva |
| PUT | `/api/bookings/[id]` | Atualizar reserva |
| POST | `/api/bookings/calculate` | Calcular preço |

### Favoritos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/favorites` | Listar favoritos do usuário |
| POST | `/api/favorites` | Adicionar aos favoritos |
| DELETE | `/api/favorites?carId=[id]` | Remover dos favoritos |

### Notificações
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/notifications` | Listar notificações |
| PUT | `/api/notifications/[id]/mark-read` | Marcar como lida |
| POST | `/api/notifications/mark-all-read` | Marcar todas como lidas |

### Pagamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/payments/create-intent` | Criar Payment Intent |
| POST | `/api/payments/webhook` | Webhook Stripe |

### Perfil
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users/profile` | Obter perfil |
| PUT | `/api/users/profile` | Atualizar perfil |

### Admin
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/dashboard` | Métricas do dashboard |
| GET | `/api/admin/cars` | Listar todos os veículos |
| POST | `/api/admin/cars` | Criar veículo |
| PUT | `/api/admin/cars/[id]` | Atualizar veículo |
| DELETE | `/api/admin/cars/[id]` | Excluir veículo |
| GET | `/api/admin/bookings` | Listar todas as reservas |
| PUT | `/api/admin/bookings/[id]` | Atualizar reserva |
| GET | `/api/admin/users` | Listar usuários |
| PUT | `/api/admin/users/[id]` | Atualizar usuário |
| GET | `/api/admin/payments` | Listar todos os pagamentos |
| POST | `/api/admin/payments` | Processar reembolso |
| GET | `/api/admin/reviews` | Listar todas as reviews |
| PUT | `/api/admin/reviews` | Aprovar/rejeitar/responder review |

---

## Anexo: Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| Next.js 14 | Framework React com App Router |
| TypeScript | Tipagem estática |
| MongoDB Atlas | Banco de dados na nuvem |
| NextAuth.js | Autenticação com JWT |
| Stripe | Processamento de pagamentos |
| next-intl | Internacionalização (PT/EN) |
| Bootstrap 5 | Framework CSS |
| React Slick | Carrossel de imagens |
| PM2 | Gerenciador de processos (porta 3050) |

---

## Anexo: Banco de Dados

### Collections MongoDB

| Collection | Descrição |
|------------|-----------|
| `users` | Usuários do sistema (clientes e admins) |
| `cars` | Veículos disponíveis para aluguel |
| `bookings` | Reservas realizadas |
| `payments` | Transações de pagamento |
| `notifications` | Notificações dos usuários |
| `reviews` | Avaliações dos clientes sobre veículos |

### Dados Atuais
- **Veículos:** 6 carros cadastrados com imagens, descrições, FAQ e reviews
- **Imagens:** 4 fotos de carros diferentes para galeria

---

*Documento atualizado em: Janeiro 2026*
*Versão: 2.1 - Adicionadas páginas admin: Payments, Reviews, Reports, Settings*
