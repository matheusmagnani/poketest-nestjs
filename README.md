<h1 align= center> Pokedex style app Beckend with NestJs.</h1>

<br>

<h3>Este teste técnico consiste no desenvolvimento de uma API REST em Node.js para integrar-se à <a href="https://pokeapi.co">PokéAPI</a> e armazenar dados em um banco de dados PostgreSQL. O objetivo é avaliar conhecimentos em:</h3>

<ul>
  <li>Desenvolvimento de APIs REST com Node.js e NestJs</li>
  <li>Integração de API externa utilizando Axios</li>
  <li>Persistência de dados em PostgreSQL usando Prisma</li>
  <li>Paginação e filtros em consultas de banco de dados</li>
  <li>Boas práticas de estruturação de código e organização de projeto</li>
  <li>Tratamento de erros e respostas HTTP padronizadas</li>
  <li>Autenticação e autorização com JWT</li>
</ul>

# RFs (Requisitos Funcionais)

- [x] -> Deve ser possivel um novo usuário se cadastrar na aplicaçao.
- [x] -> Deve ser possivel que um usuário faça login na aplicaçao.
- [x] -> Deve ser possivel cadastrar um pokémon buscando pelo nome.
- [x] -> Deve ser possivel listar os pokémons cadastrados.


# RN (Regras de Regócio)

- [x] -> Não deve permitir a inserção de pokémons duplicados.
- [x] -> Apenas usuários autenticados podem cadastrar Pokémons.
- [x] -> O usuário deve fornecer um e-mail e uma senha para cadastrar.
- [x] -> O usuário deve fornecer um e-mail e uma senha para fazer login.
- [x] -> O e-mail deve ser único no sistema.
- [x] -> O objeto salvo de cadastro de Pokémon deve conter: id, nome, altura, peso, habilidades e imagem.



# RNFs (Regras Nao Funcionais)

- [x] -> A senha para cadastro deve ser armazenada de forma segura utilizando hashing.
- [x] -> As rotas de Cadastrar Pokémon e Listar Pokémons devem ser verificadas com um Token JWT

## :books: Requisitos


- [**Node.js**](https://nodejs.org/en/)
- [**Yarn**](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## Iniciando o projeto

```bash

  # Clonar o projeto:

  $ git clone https://github.com/matheusmagnani/poketest

  # Entrar no diretório web

  $ cd poketest-nestjs
  
   # Instalando as dependências
   
  $ yarn 

  # Iniciar web

  $ yarn start:dev
  

```

<h3>Tecnologias Utilizadas</h3>

<ul>
  <li>Node.js (v14+)</li>
  <li> Nest - Framework para API REST</li>
  <li>Typescript</li>
  <li>Prisma - ORM para PostgreSQL</li>
  <li>PostgreSQL - Banco de dados relacional</li>
  <li>Axios - Cliente HTTP para integração com a PokéAPI</li>
  <li>dotenv - Gerenciamento de variáveis de ambiente</li>
  <li>jsonwebtoken (JWT) - Autenticação e autorização</li>
  <li>bcrypt - Hashing seguro de senhas</li>
  <li>Docker - para facilitar a execução do projeto.</li>
  <li>Zod - Validações avançadas </li>
</ul>


<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,ts,prisma,express,docker,zod" />
  </a>
</p>

<br>

<p align="center">
  <img src="http://img.shields.io/static/v1?label=STATUS&message=PRONTO&color=GREEN&style=for-the-badge"/>
</p>