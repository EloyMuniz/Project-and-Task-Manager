import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

interface Task {
    use_uuid: string,
    task_description: string,
    task_title: string,
    task_date_conclude: string,
    project_uuid: string
}


class TasksController {
    public async createTask(req: Request, res: Response) {

        try {
            const { task_description, task_title, task_date_conclude, project_uuid }: Task = req.body
            const result = await prisma.task.findFirst({
                where: { task_title: task_title }
            })

            if (result && result.task_title) {
                return res.status(409).json({ message: "Já existe uma tarefa de mesmo nome!" })
            }

            await prisma.task.create({
                data: { task_description: task_description, task_title: task_title, project_uuid: project_uuid }

            })
            return res.status(200).json({ message: "A tarefa foi criada com sucesso!" })



        } catch (error) {
            return res.status(400).json({ message: "Não foi possível criar uma nova tarefa!" })
        }

    }

    public async taskVizualize(req: Request, res: Response) {


        try {
            const { project_uuid }: { project_uuid: string } = req.body
            const result = await prisma.task.findMany({

                where: { project_uuid: project_uuid }
            })
            return res.status(200).json({ message: result })

        } catch (error) {
            return res.status(400).json({ message: "Não foi possível retornar as informações!" })
        }

    }
    //API para concluir uma tarefa ou reiniciar uma tarefa
    public async taskConcluded(req: Request, res: Response) {
        try {
            const { task_uuid, task_concluded }: { task_uuid: string, task_concluded: boolean } = req.body

            await prisma.task.update({
                data: { task_concluded: task_concluded },
                where: { task_uuid: task_uuid }
            })

            return res.status(200).json({ message: "A informação foi atualizada com sucesso!" })

        } catch (error) {
            return res.status(400).json({ message: "Não foi possível concluir a tarefa!" })
        }

    }
    //API para deletar ou recuperar uma tarefa
    public async taskDeleted(req: Request, res: Response) {
        try {
            const { task_uuid, task_excluded }: { task_uuid: string, task_excluded: boolean } = req.body
            await prisma.task.update({
                data: { task_excluded: task_excluded },
                where: { task_uuid: task_uuid }
            })

            return res.status(200).json({ message: "A informação foi atualizada com sucesso!" })

        } catch (error) {
            return res.status(400).json({ message: "Não foi possível deletar a tarefa!" })
        }



    }

}

export default new TasksController()