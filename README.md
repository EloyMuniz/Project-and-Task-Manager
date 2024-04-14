How to use

Certifique-se de ter o Node.js e o Yarn instalados. Clone o repositório e instale as dependências:

$ git clone https://github.com/EloyMuniz/TesteJedis

# Instalar dependências

$ yarn install

Para iniciar o servidor em modo de desenvolvimento e iniciar automaticamente sempre que houver alterações no código-fonte, use:

$ yarn dev

# Para iniciar o servidor em um ambiente de produção, use:

$ yarn start

Banco de Dados

Para gerar o schema do Prisma(ORM), execute:

$ npx prisma generate

# Para migrar as tabelas do banco de dados, execute:

$ npx prisma migrate

Testes

Para executar os testes usando Jest, execute:

$ yarn test

# Documentação

A documentação de todas as APIs do projeto está disponível na rota: /docs.

# Contato

Se tiver dúvidas ou sugestões, sinta-se à vontade para entrar em contato!
