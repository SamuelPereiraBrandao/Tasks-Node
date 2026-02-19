# Tasks Node API

API simples de tarefas feita com Node.js puro (`http`), sem framework.

## Objetivo

Projeto de estudo para praticar:
- rotas HTTP
- leitura de JSON no body
- persistencia em arquivo local (`db.json`)
- operacoes CRUD

## Tecnologias

- Node.js
- JavaScript (ES Modules)

## Documentacao Postman

- Link da documentacao: https://documenter.getpostman.com/view/32790910/2sBXcEizME

- 
## Como rodar

1. Instale o Node.js (versao 18+ recomendada).
2. No projeto, execute:

```bash
npm install
npm run dev
```

A API sobe em `http://localhost:3333`.

Para rodar sem watch:

```bash
npm start
```

## Rotas

### `GET /tasks`

Lista todas as tarefas.

Query opcional:
- `search`: filtra por `title` ou `description`

Exemplo:

```bash
curl "http://localhost:3333/tasks?search=estudar"
```

### `POST /tasks`

Cria uma nova tarefa.

Body JSON obrigatorio:

```json
{
  "title": "Estudar Node",
  "description": "Revisar rotas e middlewares"
}
```

Exemplo:

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Estudar Node\",\"description\":\"Revisar rotas e middlewares\"}"
```

### `PUT /tasks/:id`

Atualiza `title` e `description` de uma tarefa.

Body JSON obrigatorio:

```json
{
  "title": "Novo titulo",
  "description": "Nova descricao"
}
```

Exemplo:

```bash
curl -X PUT http://localhost:3333/tasks/SEU_ID \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Novo titulo\",\"description\":\"Nova descricao\"}"
```

### `DELETE /tasks/:id`

Remove uma tarefa pelo `id`.

Exemplo:

```bash
curl -X DELETE http://localhost:3333/tasks/SEU_ID
```

## Estrutura

```txt
src/
  server.js
  database.js
  middlewares/
    json.js
  utils/
    build-route-path.js
db.json
```

## Scripts

- `npm run dev`: inicia com watch
- `npm start`: inicia normalmente
- `npm test`: placeholder (sem testes ainda)

