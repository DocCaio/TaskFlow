# TaskFlow Web

Front-end do **TaskFlow**, um gerenciador de tarefas feito com React e TypeScript. Ele consome a [TaskFlow API](https://github.com/SEU-USUARIO/TaskFlow-Api) (Spring Boot + PostgreSQL).

O projeto foi criado para praticar testes automatizados, CI/CD, código limpo, Docker, performance, Web Vitals e observabilidade, usando a stack moderna do ecossistema React.

## Funcionalidades

- Lista de tarefas com **busca** e **filtro por status** (A fazer, Em andamento, Concluída)
- **Adicionar rápido** direto na Home: digite o título e aperte Enter
- **Checklist**: marque a caixinha para concluir a tarefa (o título fica riscado)
- Troca de status, edição e exclusão (com confirmação)
- Formulário completo de nova tarefa, com validação e exibição dos erros da API
- Notificações (toasts) de sucesso e erro
- Estados de carregando, lista vazia e erro, com botão "Tentar novamente"
- Tema escuro com cores de Halloween (laranja e verde)

## Stack

| Tecnologia | Para quê |
|---|---|
| React + TypeScript + Vite | Base da aplicação |
| React Router | Rotas, carregadas sob demanda (code splitting) |
| TanStack Query | Dados do servidor: cache, loading, erro e atualização da lista |
| Zustand | Estado de UI (filtros de status e busca) |
| Context API | Notificações (toasts) |
| Tailwind CSS v4 | Estilo e tema |
| web-vitals | Métricas de performance (LCP, INP, CLS, FCP, TTFB) |
| Vitest + Testing Library | Testes |
| ESLint | Qualidade de código |

## Rotas

| Rota | Página |
|---|---|
| `/` | Lista de tarefas, busca, filtros e campo de adicionar rápido |
| `/postar` | Formulário de nova tarefa |
| `/tarefas/:id/editar` | Edição de tarefa |
| `/sobre` | Sobre o projeto |
| `*` | Página não encontrada |

## Estrutura

```
src/
├── api/                  # cliente HTTP (fetch + ApiError)
├── app/                  # providers e router
├── assets/               # logo
├── components/
│   ├── layout/           # Navbar, Footer, Layout
│   └── ui/               # Button e estilos compartilhados
├── context/              # ToastProvider e useToast
├── features/
│   └── tasks/            # tudo de tarefas: api, hooks, store, filtro, validação e componentes
├── lib/                  # env, queryClient, webVitals
├── pages/                # Home, Postar, EditarTarefa, Sobre, NotFound
└── test/                 # setup, fixtures e render com providers
```

Decisões de organização:

- `features/tasks` concentra tudo do domínio de tarefas. `components/` só tem o que é genérico.
- Os testes ficam **ao lado do código** (`TaskCard.tsx` e `TaskCard.test.tsx` na mesma pasta). O que é compartilhado entre os testes fica em `src/test/`.
- Dados do servidor ficam no TanStack Query, estado de interface no Zustand e o que é global e simples no Context.

## Pré-requisitos

- Node.js 22
- Yarn 1 (clássico)
- A [TaskFlow API](https://github.com/SEU-USUARIO/TaskFlow-Api) rodando (por padrão em `http://localhost:8080`)

## Rodando localmente

```bash
# 1. instale as dependências
yarn install

# 2. (opcional) crie o .env se a API não estiver em localhost:8080
cp .env.example .env

# 3. suba o servidor de desenvolvimento
yarn dev
```

O front sobe em `http://localhost:5173`. A API já libera as origens `http://localhost:5173` e `http://localhost:3000` no CORS. Se o Vite subir em outra porta, essa origem precisa ser liberada na API.

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | URL base da API, sem barra no final |
| `VITE_VITALS_URL` | *(vazia)* | Se definida, as métricas de Web Vitals são enviadas para esse endereço por `sendBeacon` |

As variáveis do Vite são gravadas no bundle **na hora do build**. Depois de mudar um valor, é preciso gerar um novo build (ou reiniciar o `yarn dev`).

## Scripts

| Comando | O que faz |
|---|---|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Checa os tipos e gera o build em `dist/` |
| `yarn preview` | Serve o build localmente |
| `yarn lint` | Roda o ESLint |
| `yarn test` | Testes em modo watch |
| `yarn test --run` | Roda os testes uma vez (é o que o CI usa) |
| `yarn test:coverage` | Testes com relatório de cobertura |

## Testes

Os arquivos `*.test.ts(x)` ficam ao lado do código que testam:

- **Unitários:** filtro, validação, store do Zustand, cliente HTTP, camada de API, QueryClient e Web Vitals
- **Componentes:** TaskCard, TaskForm, TaskFilter, QuickAddTask, StatusBadge, Navbar, Footer, Layout e ToastProvider
- **Páginas:** Home, Postar, EditarTarefa, Sobre e NotFound, com a camada de API mockada. Cobrem carregando, vazio, erro, filtros, criação, edição, exclusão e checklist

## Performance e Web Vitals

- Cada página é um chunk separado (`lazy` do React Router), então a Home não baixa o código das outras telas.
- O QueryClient usa cache de 30 segundos e não refaz a busca ao focar a janela.
- `reportWebVitals()` roda no `main.tsx`. Em desenvolvimento, as métricas aparecem no console. Com `VITE_VITALS_URL` definida, elas são enviadas para esse endereço.

## CI

O workflow `.github/workflows/frontend-ci.yml` roda a cada push na `main` e a cada pull request:

1. Instala as dependências (`yarn install --frozen-lockfile`)
2. Lint (`yarn lint`)
3. Build (`yarn build`)
4. Testes (`yarn test --run`)

## Deploy (Vercel)

1. Importe o repositório na Vercel. O preset **Vite** é detectado automaticamente (build `yarn build`, saída `dist`).
2. Em **Environment Variables**, defina `VITE_API_URL` com a URL pública da API, sem barra no final (ex.: `https://taskflow-api.onrender.com`).
3. Faça o deploy.
4. Adicione a URL final da Vercel em `APP_CORS_ALLOWED_ORIGINS` na API, senão o navegador bloqueia as requisições.

O arquivo `vercel.json` na raiz faz qualquer rota cair no `index.html`. Sem ele, recarregar `/postar` ou `/sobre` retorna 404.

Se a API estiver em um plano gratuito que dorme por inatividade, a primeira requisição pode demorar cerca de um minuto. Se o front mostrar erro de conexão, aguarde e use "Tentar novamente".

## Docker (opcional)

O repositório inclui um `Dockerfile` (build com Node e servidor Nginx) para quem preferir rodar o front em container:

```bash
docker build -t taskflow-web --build-arg VITE_API_URL=http://localhost:8080 .
docker run -p 3000:80 taskflow-web
```

Abra `http://localhost:3000`. A URL da API é fixada no build, então para outro ambiente é preciso gerar outra imagem.

## Solução de problemas

**"Não foi possível conectar ao servidor (http://...)"**
A mensagem mostra o endereço que o front tentou chamar. Confira:

1. A API está no ar? Abra `<URL>/actuator/health` no navegador.
2. A URL da mensagem é a esperada? Se não for, revise `VITE_API_URL` e reinicie o `yarn dev` (ou refaça o deploy).
3. É CORS? Abra o DevTools (F12) e veja o Console. Se aparecer "blocked by CORS policy", a origem do front não está liberada na API.

**Página dá 404 ao recarregar em produção**
Falta o `vercel.json` com a regra de rewrite para `index.html`.

## Autor

Feito por Caio.
