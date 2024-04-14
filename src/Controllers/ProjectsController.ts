import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

interface Project {
    project_name: string,
    project_description: string,
    use_uuid: string,
}

class ProjectsController {
    //API para criar um novo projeto
    public async createProject(req: Request, res: Response) {

        try {
            const { use_uuid, project_name, project_description }: Project = req.body
            const name = await prisma.project.findFirst({
                where: { project_name: project_name }
            })
            if (name) {
                return res.status(409).json({ message: "O nome do projeto já existe." });
            }

            await prisma.project.create({
                data: { project_name: project_name, use_uuid: use_uuid, project_description: project_description }

            })
            return res.status(200).json({ message: "O projeto foi criado com sucesso!" })


        } catch (error) {
            return res.status(400).json({ message: "Não foi possível criar um novo projeto!" })
        }


    }
    //API para vizualizar projetos atrelados a um usuário
    public async projectVizualize(req: Request, res: Response) {
        try {
            const { use_uuid }: { use_uuid: string } = req.body
            const result = await prisma.project.findMany({
                where: { use_uuid: use_uuid },
                select: { project_description: true, project_name: true, project_created_at: true }

            })
            const modifiedResult = result.map(element => {

                const date = new Date(element.project_created_at);
                const formattedDate = date.toISOString().split("T")[0];

                return { ...element, project_created_at: formattedDate };
            });

            return res.status(200).json({ message: modifiedResult })



        } catch (error) {
            return res.status(400).json({ message: "Não foi possível retornar as informações!" })
        }



    }


}

export default new ProjectsController()