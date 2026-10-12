# RandPPlanner ⚡ Studio Planner

Planejador moderno e interativo integrado ao **Google Agenda** e **Google Tasks**, desenvolvido com **Next.js**, **Tailwind CSS** e **TypeScript**, projetado especialmente para jovens e adolescentes organizarem sua rotina com estilo.

---

## 🚀 Funcionalidades

- **Design inspirado no Google AI / Roblox Studio:** Fundo escuro com glow neon, micro-interações, efeitos de partículas (confetti) e tipografia moderna.
- **Google Agenda:**
  - Criação de eventos com período e horários específicos.
  - Recorrência completa (diário, semanal ou mensal).
  - Alertas antecipados nativos (push no celular e email).
  - Tags de categorização (📚 Estudos, ⚽ Treinos, 🎉 Rolês, 🎮 Games, ⚡ Foco).
- **Google Tasks & Notas:**
  - Sincronização em tempo real de tarefas e anotações.
- **Compartilhamento WhatsApp:**
  - Compartilhe o evento ou nota em 1 clique com mensagem formatada pronta para enviar no WhatsApp.

---

## 🛠️ Tecnologias

- **Next.js 16 (App Router)**
- **NextAuth.js (Auth.js)** com provedor Google OAuth 2.0
- **Google APIs (`googleapis`)** para Calendar e Tasks
- **Tailwind CSS v4** + **Lucide React** + **Canvas-Confetti**

---

## ⚙️ Variáveis de Ambiente (Vercel & Local)

Configure as seguintes variáveis no arquivo `.env.local` (ou no painel da **Vercel**):

```env
GOOGLE_CLIENT_ID="seu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
NEXTAUTH_URL="https://seu-dominio.vercel.app"  # ou http://localhost:3000 para local
NEXTAUTH_SECRET="uma-chave-secreta-aleatoria-longa"
```

---

## 📦 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000).
