import { Request, Response } from 'express';
import app from "../src/server";
import supertest from 'supertest';

const request = supertest(app);

describe('Conjunto de testes para a API de registro do usuário', () => {
  it('deve retornar um status 200 e uma mensagem de sucesso', async () => {
    const userData = {
      use_email: 'developer@gmail.com',
      use_name: 'Exemplo',
      use_password: 'password123',
      use_confirm_password: 'password123'
    };

    const response = await request
      .post('/register')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Seus dados foram cadastrados com sucesso!');
  });

  it('deve retornar 400 se o e-mail for inválido', async () => {
    const userData = {
      use_email: 'example',
      use_name: 'Exemplo',
      use_password: 'password123',
      use_confirm_password: 'password123'
    };

    const response = await request
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('O email não é válido!');
  });



  // Outros casos de teste para cobrir diferentes cenários, como e-mail já existente, senha curta, senhas não coincidentes, etc.
});
