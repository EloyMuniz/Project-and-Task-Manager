import { Request, Response } from 'express';
import app from "../src/server";
import supertest from 'supertest';
const request = supertest(app);

describe("Conjunto de testes para criação de Projeto", () => {
    it("deve retornar um status 200 e uma mensagem de sucesso", async () => {

        const token = 'um_token_valido';
        const projectData = {
            use_uuid: '500bb692-ac49-47b5-9072-28b5e4ad4849',
            project_description: "Ola, estou testando a aplicação!",
            project_name: "Teste23"
        };

        const response = await request.post('/createproject').set('Authorization', `Bearer ${token}`).send(projectData)


        expect(response.status).toBe(200);
        expect(response.body.message).toBe('O projeto foi criado com sucesso!');


    })


})
describe("Conjunto de testes para vizualização de projetos para um usuário", () => {
    it("deve retornar um status 200 e o objeto.", async () => {

        const token = 'um_token_valido';
        const projectData = {
            use_uuid: '500bb692-ac49-47b5-9072-28b5e4ad4849',
        };

        const response = await request.post('/projectvizualize').set('Authorization', `Bearer ${token}`).send(projectData)


        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();


    })


})