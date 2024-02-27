# Desafio Haytek

[Desafio técnico](https://github.com/haytek-project/test-haytek) realizado como parte do processo seletivo para desenvolvedor da Haytek.

## Tecnologias utilizadas

### Backend

- [Node.js](https://nodejs.org/en)
- [NestJS](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Jest](https://jestjs.io/)

### Frontend

- [React](https://react.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Mantine](https://mantine.dev/)

## Configurações

Existem dois projetos neste repositório: server e client, cada um com suas configurações.

### Server

Deve-se criar um arquivo `.env` na pasta `server`, com as seguintes configurações:

- `PORT`: porta em que a aplicação será executada.
- `HAYTEK_API_URL`: URL da API fornecida pela Haytek.

Um exemplo deste arquivo `.env.example` está disponível na pasta `server`.

### Client

Deve-se criar um arquivo `.env.local` na pasta `client`, com as seguintes configurações:

- `VITE_SERVER`: URL da aplicação do projeto `server` a ser utilizada.

Um exemplo deste arquivo `.env.example` está disponível na pasta `client`.

## Como executar

Foi utilizado o `yarn` como gerenciador de pacotes, então é necessário que esteja instalado antes de prosseguir.

### Server

Após configurar corretamente o arquivo `.env`, a partir da raíz do repositório:

```bash
cd server
# Instalar dependências
yarn
# Iniciar aplicação
yarn start
```

Após isso, a aplicação está executando na porta definida no arquivo `.env`, acessível através de `http://localhost:3000/`.

### Client

Após configurar corretamente o arquivo `.env.local`, a partir da raíz do repositório:

```bash
cd client
# Instalar dependências
yarn
# Iniciar aplicação
yarn dev
```

Após isso, a aplicação está executando na porta `5173`, acessível através de `http://localhost:5173/`.
