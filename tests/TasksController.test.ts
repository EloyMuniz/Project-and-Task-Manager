import { Request, Response } from 'express';
import app from "../src/server";
import supertest from 'supertest';
const request = supertest(app);

describe("Conjunto de testes para criação de Tarefa", () => {
    it("deve retornar um status 200 e uma mensagem de sucesso", async () => {

        const token = 'um_token_valido';
        const projectData = {
            task_description: 'Descrição da tarefa',
            task_title: 'Título da tarefa',
            task_date_conclude: "2024-04-05",
            project_uuid: 'a6fa013e-c213-4a7a-8333-fb644ba021aa'
        };

        const response = await request.post('/createtask').send(projectData)


        expect(response.status).toBe(200);
        expect(response.body.message).toBe('A tarefa foi criada com sucesso!');


    })


})
