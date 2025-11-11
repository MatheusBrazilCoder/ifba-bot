## IFBA Bot

Aplicação web construída com Next.js para facilitar o acesso a perguntas frequentes, buscas e gerenciamento básico de conteúdos relacionados ao IFBA. O projeto combina uma camada de APIs mockadas com uma interface rica em componentes reutilizáveis inspirados no ecossistema shadcn/ui.

## Tecnologias

- **Next.js 16 (App Router)** para renderização híbrida (SSR/SSG) e roteamento baseado em pastas.
- **React 19** com **TypeScript** para componentes tipados e experiência de desenvolvimento segura.
- **Tailwind CSS 4** e utilitários como `tailwind-merge` e `tailwindcss-animate` para estilização responsiva.
- **Radix UI / shadcn/ui** (via componentes em `components/ui`) garantindo acessibilidade e consistência visual.
- **Lucide Icons** (`lucide-react`) para ícones vetoriais.
- **React Hook Form** e **Zod** (preparados para validações tipadas).
- **date-fns**, **Recharts**, **Embla** e outros pacotes disponíveis para features específicas.
- **APIs Next.js** baseadas em `NextResponse` que simulam persistência usando `public/mock-data.json`.

## Arquitetura do Sistema

1. **Camada de UI (App Router)**: páginas são compostas a partir de `app/page.tsx` (landing) e componentes especializados em `components/pages`. A navegação, header e temas são controlados por provedores globais (`components/layout`, `components/theme-provider`).
2. **Camada de API**: rotas em `app/api/**` expõem endpoints RESTful (`GET`, `POST`) que leem e atualizam dados mockados. Ex.: `app/api/questions/route.ts` filtra perguntas por categoria/status e aceita novas submissões.
3. **Componentização shadcn/ui**: `components/ui` contém wrappers reutilizáveis dos componentes Radix (botões, diálogos, formulários, etc.), padronizando estilo e acessibilidade.
4. **Hooks utilitários**: `hooks/use-mobile` detecta viewport; `hooks/use-toast` integra o sistema de toasts baseado em Radix.
5. **Helpers e utilidades**: `lib/utils.ts` agrega funções auxiliares (como `cn` para classes CSS).

O fluxo típico consiste em componentes de página consumindo dados das APIs internas (via `fetch`), renderizando listas, filtros e detalhes de perguntas. As APIs servem dados mockados, mas estão preparadas para serem substituídas por uma camada real (banco de dados ou serviços externos).

## Organização de Pastas

- `app/`
  - `layout.tsx`: layout raiz e provedores de tema.
  - `page.tsx`: página inicial que orquestra componentes de interface.
  - `globals.css`: estilos globais complementares ao Tailwind.
  - `api/`: endpoints Next.js (ex.: `questions`, `answers`, `search`, `users`, `search-history`). Cada pasta define handlers REST (`route.ts`) que manipulam dados mockados.
- `components/`
  - `auth/`: fluxos de autenticação (ex.: `login-form.tsx`).
  - `common/`: componentes compartilhados (editor e renderer Markdown, campos de busca).
  - `layout/`: navegação principal (`nav-top`, `navbar`).
  - `pages/`: composições completas de páginas (`home`, `faq`, `question-detail`, `settings`).
  - `ui/`: biblioteca de componentes baseados em Radix/shadcn (botões, diálogos, tabelas, etc.).
- `hooks/`: hooks personalizados reutilizáveis (`use-mobile`, `use-toast`).
- `lib/`: utilidades genéricas (`utils.ts`).
- `public/`: arquivos estáticos e mocks (`mock-data.json` com perguntas e respostas).
- `styles/`: alternativas ou complementos de estilos (ex.: `globals.css` legado).
- Arquivos de configuração (`next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json`) sustentam a build e o ambiente de desenvolvimento.
