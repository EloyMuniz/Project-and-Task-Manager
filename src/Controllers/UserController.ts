import { Request, Response, application } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,

    secure: true, //Usar "false" para ambiente de desenvolvimento
    auth: {
        user: "", //Email 
        pass: "", //Senha
    },
    tls: {
        rejectUnauthorized: true, //Usar "false" para ambiente de desenvolvimento
    },
});


interface Users {
    use_email: string;
    use_name:string
    use_password: string
    use_confirm_password: string
}

class UserController {
    //API que registra um novo usuário no banco de dados.
    public async registerUsers(req: Request, res: Response) {
        try {

            const { use_email, use_name, use_password, use_confirm_password }: Users = req.body;
            console.log(use_email)
            const result = await prisma.users.findFirst({
                where: { use_email: use_email }
            })

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            
            if (!emailRegex.test(use_email)) {
                return res.status(400).json({ message: "O email não é válido!" });
            }
            if (result) {
                return res.status(400).json({ message: "O email já está em uso!" })

            }
         
            if (use_password.length < 4) {
                return res
                    .status(400)
                    .json({ message: "A senha precisa ter 4 ou mais caracteres!" });
            }
            if (use_password != use_confirm_password) {
                return res.status(400).json({ message: "A senha e a confirmação precisam ser iguais!" })
            }
            const saltRounds = 10;
            const passwordHash: string = bcrypt.hashSync(use_password, saltRounds);


            await prisma.users.create({
                data: {
                    use_email: use_email,
                    use_password: passwordHash,
                    use_name:use_name

                }
            })
            const emailBody = `
    <p>Olá,${use_name}</p>
    <p>Agradecemos por se cadastrar em nosso Gerenciador de Tarefas!</p>
    
`;

            const mailOptions = {
                from: "",
                to: [use_email], 
                subject: "Criação de conta no Gerenciador de Projetos",
                html: emailBody,
            };

            // Enviar o email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Erro ao enviar o email." });
                } else {
                    return res.status(200).json({

                        message: "Email enviado com sucesso! ",
                    });
                }
            });
            return res.status(200).json({ message: "Seus dados foram cadastrados com sucesso!" })

        } catch (error) {

            return res.status(400).json({ message: `Não foi possível registrar seus dados! ${error}` })


        }


    }
}
export default new UserController()