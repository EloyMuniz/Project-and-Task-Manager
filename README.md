# Definições Gerais

 A aplicação back-end trata-se de um gerenciador de projetos que permite aos usuários criar e gerenciar projetos e suas respectivas tarefas.

# How to use

Certifique-se de ter o Node.js e o Yarn instalados. Clone o repositório:

$ git clone https://github.com/EloyMuniz/TesteJedis

# Instalar dependências e iniciar servidor

$ yarn install

Para iniciar o servidor em modo de desenvolvimento e iniciar automaticamente sempre que houver alterações no código-fonte, use:

$ yarn dev

Para iniciar o servidor em um ambiente de produção, use:

$ yarn start

# Banco de Dados

Para gerar o schema do Prisma(ORM), execute:

$ npx prisma generate

Para migrar as tabelas do banco de dados, execute:

$ npx prisma migrate dev

# Testes

Para executar os testes usando Jest, execute:

$ yarn test

# Documentação

A documentação de todas as APIs foi criada com Swagger e está disponível na rota: /docs

# Contato

Se tiver dúvidas ou sugestões, sinta-se à vontade para entrar em contato!

Abaixo, o diagrama do Banco de Dados

![Diagrama do Schema do Banco](prisma.svg)
