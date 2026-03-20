# 🧠 AgendaPsi

> **Gestão Clínica Inteligente para Psicólogos**

AgendaPsi é um aplicativo web progressivo (PWA) desenvolvido para psicólogos gerenciarem seus pacientes, agendamentos, finanças e lembretes de forma simples, moderna e segura — direto do celular ou computador.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📋 **Gestão de Pacientes** | Cadastro completo com nome, telefone, frequência, aniversário e observações |
| 📅 **Agenda Inteligente** | Visualização semanal com navegação por dias e status por consulta |
| 💰 **Controle Financeiro** | Filtros semanais, mensais e anuais com resumos de receita e inadimplência |
| 📲 **Lembretes via WhatsApp** | Envio rápido de lembretes personalizados diretamente pelo WhatsApp |
| 🎂 **Aniversariantes da Semana** | Exibição automática dos aniversariantes com idade calculada |
| 🔐 **Login Real** | Autenticação segura via e-mail/senha com Supabase Auth |
| 💳 **Sistema de Assinatura** | Controle de acesso por mensalidade (gerenciado pelo administrador) |
| 📱 **PWA** | Instalável no celular como app nativo (Android e iOS) |
| 🖥️ **Responsivo** | Layout adaptável para mobile (bottom nav) e desktop (sidebar) |

---

## 🛠️ Tecnologias

- **React 18** + **TypeScript** — Interface moderna e tipada
- **Vite** — Build ultrarrápido
- **Tailwind CSS** — Estilização utilitária e responsiva
- **Zustand** — Gerenciamento de estado global
- **Supabase** — Banco de dados PostgreSQL + Autenticação
- **Framer Motion** — Animações e transições fluidas
- **Lucide React** — Ícones elegantes
- **date-fns** — Manipulação de datas em pt-BR
- **vite-plugin-pwa** — Configuração PWA automática

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- Conta no [Supabase](https://supabase.com/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/marioslazaro/agendapsi.git
cd agendapsi

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz com:
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Banco de Dados

1. Crie um projeto no [Supabase](https://supabase.com/)
2. Abra o **SQL Editor** no painel do Supabase
3. Cole e execute o conteúdo do arquivo `supabase_schema.sql`
4. Em **Authentication > Providers > Email**, desative "Confirm email" para testes

---

## 📦 Deploy (Vercel)

1. Faça push do código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com/)
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático a cada push! 🎉

---

## 💳 Sistema de Assinatura

O acesso ao app é controlado por assinatura mensal:

1. Usuário cria conta → É bloqueado até o pagamento ser confirmado
2. Administrador adiciona uma linha na tabela `subscriptions` no Supabase:
   - `user_id` → ID do usuário (encontrado em Authentication > Users)
   - `status` → `active`
   - `expires_at` → Data de vencimento da mensalidade
3. O app libera o acesso automaticamente ✅

---

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (Layout)
├── hooks/            # Hooks customizados (usePullToRefresh)
├── lib/              # Configuração do Supabase
├── pages/            # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Patients.tsx
│   ├── PatientForm.tsx
│   ├── Agenda.tsx
│   ├── AppointmentForm.tsx
│   ├── Finances.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── SubscriptionExpired.tsx
├── store/            # Estado global (Zustand + Supabase)
├── utils/            # Utilitários (WhatsApp)
├── App.tsx           # Rotas e guards de autenticação
└── main.tsx          # Ponto de entrada
```

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

<p align="center">
  Feito com 💜 para psicólogos que transformam vidas.
</p>
