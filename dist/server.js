"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express4 = __toESM(require("express"));

// src/Controllers/UserController.ts
var import_client = require("@prisma/client");
var import_nodemailer = __toESM(require("nodemailer"));
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var prisma = new import_client.PrismaClient();
var transporter = import_nodemailer.default.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  //Usar "false" para ambiente de desenvolvimento
  auth: {
    user: "",
    //Email 
    pass: ""
    //Senha
  },
  tls: {
    rejectUnauthorized: true
    //Usar "false" para ambiente de desenvolvimento
  }
});
var UserController = class {
  //API que registra um novo usuário no banco de dados.
  registerUsers(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email, use_name, use_password, use_confirm_password } = req.body;
        const result = yield prisma.users.findFirst({
          where: { use_email }
        });
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(use_email)) {
          return res.status(400).json({ message: "O email n\xE3o \xE9 v\xE1lido!" });
        }
        if (result) {
          return res.status(400).json({ message: "O email j\xE1 est\xE1 em uso!" });
        }
        if (use_password.length < 4) {
          return res.status(400).json({ message: "A senha precisa ter 4 ou mais caracteres!" });
        }
        if (use_password != use_confirm_password) {
          return res.status(400).json({ message: "A senha e a confirma\xE7\xE3o precisam ser iguais!" });
        }
        const saltRounds = 10;
        const passwordHash = import_bcrypt.default.hashSync(use_password, saltRounds);
        yield prisma.users.create({
          data: {
            use_email,
            use_password: passwordHash,
            use_name
          }
        });
        const emailBody = `
                <p>Ol\xE1,${use_name}</p>
                <p>Agradecemos por se cadastrar em nosso Gerenciador de Tarefas!</p>

            `;
        const mailOptions = {
          from: "",
          to: [use_email],
          subject: "Cria\xE7\xE3o de conta no Gerenciador de Projetos",
          html: emailBody
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao enviar o email." });
          } else {
            return res.status(200).json({
              message: "Email enviado com sucesso! "
            });
          }
        });
        return res.status(200).json({ message: "Seus dados foram cadastrados com sucesso!" });
      } catch (error) {
        return res.status(400).json({ message: `N\xE3o foi poss\xEDvel registrar seus dados! ${error}` });
      }
    });
  }
  //API para login do usuário
  login(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email, use_password } = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(use_email)) {
          return res.status(400).json({ message: "O email n\xE3o \xE9 v\xE1lido." });
        }
        const existingEmail = yield prisma.users.findFirst(
          {
            select: { use_uuid: true, use_email: true, use_password: true, use_name: true },
            where: { use_email }
          }
        );
        const result = existingEmail == null ? void 0 : existingEmail.use_password;
        if (!existingEmail) {
          return res.status(404).json({ message: "Este email n\xE3o existe em nosso banco de dados!" });
        }
        const checkPassword = result ? import_bcrypt.default.compareSync(use_password, result) : false;
        if (!checkPassword) {
          return res.status(404).json({ message: "Senha inv\xE1lida" });
        }
        const secret = process.env.SECRET;
        if (secret === void 0) {
          return res.status(400).json({ message: "A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida." });
        }
        const token = import_jsonwebtoken.default.sign(
          { id: existingEmail.use_uuid },
          secret
        );
        return res.status(200).json({ message: "Login efetuado com sucesso!", acesso: token, use_id: existingEmail.use_uuid, use_name: existingEmail.use_name });
      } catch (error) {
        return res.status(400).json({ message: `N\xE3o foi poss\xEDvel logar no aplicativo!${error}` });
      }
    });
  }
  //Inicia o processo de recuperação de senha enviando um email com um link de token único para o usuário. 
  //Também atualiza o registro do usuário com o token gerado.
  sendEmail(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email } = req.body;
        const search = yield prisma.users.findFirst({ select: { use_uuid: true }, where: { use_email } });
        if (!search) {
          return res.status(400).json({ message: "Esse email n\xE3o existe!" });
        }
        const codigo = Math.floor(1e3 + Math.random() * 9e3).toString();
        const dataDeExpiracao = /* @__PURE__ */ new Date();
        dataDeExpiracao.setMinutes(dataDeExpiracao.getMinutes() + 15);
        yield prisma.users.update({
          where: { use_uuid: search.use_uuid },
          data: { use_token: codigo, use_date_expire: dataDeExpiracao }
        });
        const mailOptions = {
          from: "",
          to: use_email,
          subject: "Recupera\xE7\xE3o de Senha",
          html: `
                <p>Seu c\xF3digo de recupera\xE7\xE3o de senha \xE9: <strong>${codigo}</strong></p></p>
                
              `
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao enviar o email." });
          } else {
            return res.status(200).json({
              message: "C\xF3digo enviado para o email inserido!"
            });
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar ou atualizar o token." });
      }
    });
  }
  //Permite a recuperação da senha, verificando o token enviado e atualizando a senha do usuário no banco de dados.
  passwordRecover(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_email, use_token, use_password, use_confirm_password } = req.body;
        const search = yield prisma.users.findFirst({ select: { use_uuid: true, use_date_expire: true }, where: { use_email } });
        if (!(search == null ? void 0 : search.use_uuid)) {
          return res.status(400).json({ message: "Esse email n\xE3o existe!" });
        }
        const user = yield prisma.users.findUnique({
          select: { use_token: true },
          where: {
            use_uuid: search.use_uuid
          }
        });
        if (!(use_token === (user == null ? void 0 : user.use_token))) {
          return res.status(400).json({ message: "O token n\xE3o \xE9 v\xE1lido!" });
        }
        if (search.use_date_expire && use_token === (user == null ? void 0 : user.use_token) && /* @__PURE__ */ new Date() < search.use_date_expire) {
          if (use_password.length < 4) {
            return res.status(400).json({ message: "A senha precisa ter 4 ou mais caracteres!" });
          }
          if (use_password != use_confirm_password) {
            return res.status(400).json({ message: "A senha e a confirma\xE7\xE3o precisam ser iguais!" });
          }
          const saltRounds = 10;
          const passwordHash = import_bcrypt.default.hashSync(use_password, saltRounds);
          yield prisma.users.update(
            {
              data: { use_password: passwordHash },
              where: { use_uuid: search.use_uuid }
            }
          );
          return res.status(200).json({
            message: "Senha atualizada com sucesso!"
          });
        }
        return res.status(400).json({
          message: "Token expirado!"
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Erro ao criar nova senha! ${error}` });
      }
    });
  }
};
var UserController_default = new UserController();

// routes/users.ts
var import_express = require("express");
var usersRouter = (0, import_express.Router)();
usersRouter.post("/register", UserController_default.registerUsers);
usersRouter.post("/login", UserController_default.login);
usersRouter.post(`/sendemail`, UserController_default.sendEmail);
usersRouter.post(`/password-recovery`, UserController_default.passwordRecover);
var users_default = usersRouter;

// src/Controllers/ProjectsController.ts
var import_client2 = require("@prisma/client");
var prisma2 = new import_client2.PrismaClient();
var ProjectsController = class {
  //API para criar um novo projeto
  createProject(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_uuid, project_name, project_description } = req.body;
        const name = yield prisma2.project.findFirst({
          where: { project_name }
        });
        if (name) {
          return res.status(409).json({ message: "O nome do projeto j\xE1 existe." });
        }
        yield prisma2.project.create({
          data: { project_name, use_uuid, project_description }
        });
        return res.status(200).json({ message: "O projeto foi criado com sucesso!" });
      } catch (error) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel criar um novo projeto!" });
      }
    });
  }
  //API para vizualizar projetos atrelados a um usuário
  projectVizualize(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_uuid } = req.body;
        const result = yield prisma2.project.findMany({
          where: { use_uuid },
          select: { project_description: true, project_name: true, project_created_at: true }
        });
        const modifiedResult = result.map((element) => {
          const date = new Date(element.project_created_at);
          const formattedDate = date.toISOString().split("T")[0];
          return __spreadProps(__spreadValues({}, element), { project_created_at: formattedDate });
        });
        return res.status(200).json({ message: modifiedResult });
      } catch (error) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel retornar as informa\xE7\xF5es!" });
      }
    });
  }
};
var ProjectsController_default = new ProjectsController();

// routes/projects.ts
var import_express2 = require("express");

// src/service/token.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Acesso negado!" });
  try {
    const secret = process.env.SECRET;
    if (!secret)
      throw new Error("A vari\xE1vel de ambiente SECRET n\xE3o est\xE1 definida.");
    import_jsonwebtoken2.default.verify(token, secret);
    next();
  } catch (err) {
    res.status(401).json({ message: "O Token \xE9 inv\xE1lido!" });
  }
};
var token_default = checkToken;

// routes/projects.ts
var projectRouter = (0, import_express2.Router)();
projectRouter.post("/createproject", token_default, ProjectsController_default.createProject);
projectRouter.post("/projectvizualize", token_default, ProjectsController_default.projectVizualize);
var projects_default = projectRouter;

// src/Controllers/TasksController.ts
var import_client3 = require("@prisma/client");
var prisma3 = new import_client3.PrismaClient();
var TasksController = class {
  createTask(req, res) {
    return __async(this, null, function* () {
      try {
        const { task_description, task_title, task_date_conclude, project_uuid } = req.body;
        const result = yield prisma3.task.findFirst({
          where: { task_title }
        });
        if (result && result.task_title) {
          return res.status(409).json({ message: "J\xE1 existe uma tarefa de mesmo nome!" });
        }
        yield prisma3.task.create({
          data: { task_description, task_title, project_uuid }
        });
        return res.status(200).json({ message: "A tarefa foi criada com sucesso!" });
      } catch (error) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel criar uma nova tarefa!" });
      }
    });
  }
  taskVizualize(req, res) {
    return __async(this, null, function* () {
      try {
        const { project_uuid } = req.body;
        const result = yield prisma3.task.findMany({
          where: { project_uuid }
        });
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel retornar as informa\xE7\xF5es!" });
      }
    });
  }
  //API para concluir uma tarefa ou reiniciar uma tarefa
  taskConcluded(req, res) {
    return __async(this, null, function* () {
      try {
        const { task_uuid, task_concluded } = req.body;
        yield prisma3.task.update({
          data: { task_concluded },
          where: { task_uuid }
        });
        return res.status(200).json({ message: "A informa\xE7\xE3o foi atualizada com sucesso!" });
      } catch (error) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel concluir a tarefa!" });
      }
    });
  }
  //API para deletar ou recuperar uma tarefa
  taskDeleted(req, res) {
    return __async(this, null, function* () {
      try {
        const { task_uuid, task_excluded } = req.body;
        yield prisma3.task.update({
          data: { task_excluded },
          where: { task_uuid }
        });
        return res.status(200).json({ message: "A informa\xE7\xE3o foi atualizada com sucesso!" });
      } catch (error) {
        return res.status(400).json({ message: "N\xE3o foi poss\xEDvel deletar a tarefa!" });
      }
    });
  }
};
var TasksController_default = new TasksController();

// routes/task.ts
var import_express3 = require("express");
var tasksRouter = (0, import_express3.Router)();
tasksRouter.post("/createtask", TasksController_default.createTask);
tasksRouter.post("/taskvizualize", token_default, TasksController_default.taskVizualize);
tasksRouter.put("/taskconcluded", token_default, TasksController_default.taskConcluded);
tasksRouter.put("/taskexcluded", token_default, TasksController_default.taskDeleted);
var task_default = tasksRouter;

// src/server.ts
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// src/swagger.json
var swagger_default = {
  openapi: "3.1.0",
  info: {
    title: "API's de Fluxo de Usu\xE1rios, Projetos e Tarefas",
    description: "APIs para registro, login, recupera\xE7\xE3o de senha, cria\xE7\xE3o e visualiza\xE7\xE3o de projetos.",
    version: "1.0.0"
  },
  paths: {
    "/register": {
      post: {
        summary: "Cadastrar novo usu\xE1rio",
        description: "Cadastra um novo usu\xE1rio no banco de dados e envia um email de confirma\xE7\xE3o.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  use_email: {
                    type: "string",
                    format: "email",
                    description: "Email do usu\xE1rio"
                  },
                  use_name: {
                    type: "string",
                    description: "Nome do usu\xE1rio"
                  },
                  use_password: {
                    type: "string",
                    format: "password",
                    description: "Senha do usu\xE1rio"
                  },
                  use_confirm_password: {
                    type: "string",
                    format: "password",
                    description: "Confirma\xE7\xE3o da senha do usu\xE1rio"
                  }
                },
                required: [
                  "use_email",
                  "use_name",
                  "use_password",
                  "use_confirm_password"
                ]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Cadastro realizado com sucesso"
          },
          "400": {
            description: "Erro ao cadastrar usu\xE1rio"
          }
        }
      }
    },
    "/login": {
      post: {
        summary: "Login de usu\xE1rio",
        description: "Autentica um usu\xE1rio existente no sistema.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  use_email: {
                    type: "string",
                    format: "email",
                    description: "Email do usu\xE1rio"
                  },
                  use_password: {
                    type: "string",
                    format: "password",
                    description: "Senha do usu\xE1rio"
                  }
                },
                required: ["use_email", "use_password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login efetuado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Mensagem de sucesso"
                    },
                    acesso: {
                      type: "string",
                      description: "Token de acesso"
                    },
                    use_id: {
                      type: "string",
                      description: "ID do usu\xE1rio"
                    },
                    use_name: {
                      type: "string",
                      description: "Nome do usu\xE1rio"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Erro ao efetuar login"
          }
        }
      }
    },
    "/sendemail": {
      post: {
        summary: "Enviar email de recupera\xE7\xE3o de senha",
        description: "Inicia o processo de recupera\xE7\xE3o de senha enviando um email com um c\xF3digo \xFAnico para o usu\xE1rio.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  use_email: {
                    type: "string",
                    format: "email",
                    description: "Email do usu\xE1rio"
                  }
                },
                required: ["use_email"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Email de recupera\xE7\xE3o enviado com sucesso"
          },
          "400": {
            description: "Erro ao enviar email de recupera\xE7\xE3o"
          }
        }
      }
    },
    "/password-recovery": {
      post: {
        summary: "Recuperar senha",
        description: "Permite a recupera\xE7\xE3o da senha do usu\xE1rio utilizando um c\xF3digo enviado por email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  use_email: {
                    type: "string",
                    format: "email",
                    description: "Email do usu\xE1rio"
                  },
                  use_token: {
                    type: "string",
                    description: "C\xF3digo de recupera\xE7\xE3o enviado por email"
                  },
                  use_password: {
                    type: "string",
                    format: "password",
                    description: "Nova senha do usu\xE1rio"
                  },
                  use_confirm_password: {
                    type: "string",
                    format: "password",
                    description: "Confirma\xE7\xE3o da nova senha do usu\xE1rio"
                  }
                },
                required: [
                  "use_email",
                  "use_token",
                  "use_password",
                  "use_confirm_password"
                ]
              }
            }
          },
          responses: {
            "200": {
              description: "Senha atualizada com sucesso"
            },
            "400": {
              description: "Erro ao recuperar senha"
            }
          }
        }
      }
    },
    "/createproject": {
      post: {
        summary: "Criar novo projeto",
        description: "Cria um novo projeto e o associa ao usu\xE1rio autenticado.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  project_name: {
                    type: "string",
                    description: "Nome do projeto"
                  },
                  project_description: {
                    type: "string",
                    description: "Descri\xE7\xE3o do projeto"
                  },
                  use_uuid: {
                    type: "string",
                    description: "ID do usu\xE1rio"
                  }
                },
                required: ["project_name", "project_description", "use_uuid"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Projeto criado com sucesso"
          },
          "400": {
            description: "Erro ao criar projeto"
          },
          "409": {
            description: "O nome do projeto j\xE1 existe"
          }
        }
      }
    },
    "/projectvizualize": {
      post: {
        summary: "Visualizar projetos",
        description: "Retorna uma lista de projetos associados ao usu\xE1rio autenticado.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  use_uuid: {
                    type: "string",
                    description: "ID do usu\xE1rio"
                  }
                },
                required: ["use_uuid"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Lista de projetos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          project_description: {
                            type: "string",
                            description: "Descri\xE7\xE3o do projeto"
                          },
                          project_name: {
                            type: "string",
                            description: "Nome do projeto"
                          },
                          project_created_at: {
                            type: "string",
                            format: "date",
                            description: "Data de cria\xE7\xE3o do projeto (no formato YYYY-MM-DD)"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Erro ao retornar informa\xE7\xF5es"
          }
        }
      }
    },
    "/createtask": {
      post: {
        summary: "Criar nova tarefa",
        description: "Cria uma nova tarefa associada a um projeto.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  task_description: {
                    type: "string",
                    description: "Descri\xE7\xE3o da tarefa"
                  },
                  task_title: {
                    type: "string",
                    description: "T\xEDtulo da tarefa"
                  },
                  task_date_conclude: {
                    type: "string",
                    format: "date",
                    description: "Data de conclus\xE3o da tarefa (opcional)"
                  },
                  project_uuid: {
                    type: "string",
                    description: "ID do projeto associado \xE0 tarefa"
                  }
                },
                required: ["task_description", "task_title", "project_uuid"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Tarefa criada com sucesso"
          },
          "400": {
            description: "Erro ao criar tarefa"
          },
          "409": {
            description: "J\xE1 existe uma tarefa com mesmo t\xEDtulo"
          }
        }
      }
    },
    "/taskvizualize": {
      post: {
        summary: "Visualizar tarefas",
        description: "Visualiza as tarefas associadas a um projeto.",
        security: [
          {
            BearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  project_uuid: {
                    type: "string",
                    description: "ID do projeto"
                  }
                },
                required: ["project_uuid"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Lista de tarefas retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      task_description: {
                        type: "string",
                        description: "Descri\xE7\xE3o da tarefa"
                      },
                      task_title: {
                        type: "string",
                        description: "T\xEDtulo da tarefa"
                      },
                      task_date_conclude: {
                        type: "string",
                        format: "date",
                        description: "Data de conclus\xE3o da tarefa"
                      },
                      project_uuid: {
                        type: "string",
                        description: "ID do projeto associado \xE0 tarefa"
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Erro ao retornar informa\xE7\xF5es"
          }
        }
      }
    },
    "/taskconcluded": {
      put: {
        summary: "Concluir tarefa",
        description: "Atualiza o status de conclus\xE3o de uma tarefa.",
        security: [
          {
            BearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  task_uuid: {
                    type: "string",
                    description: "ID da tarefa"
                  },
                  task_concluded: {
                    type: "boolean",
                    description: "Status de conclus\xE3o da tarefa"
                  }
                },
                required: ["task_uuid", "task_concluded"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Status de conclus\xE3o atualizado com sucesso"
          },
          "400": {
            description: "Erro ao concluir a tarefa"
          }
        }
      }
    },
    "/taskexcluded": {
      put: {
        summary: "Excluir/recuperar tarefa",
        description: "Atualiza o status de exclus\xE3o de uma tarefa.",
        security: [
          {
            BearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  task_uuid: {
                    type: "string",
                    description: "ID da tarefa"
                  },
                  task_excluded: {
                    type: "boolean",
                    description: "Status de exclus\xE3o da tarefa"
                  }
                },
                required: ["task_uuid", "task_excluded"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Status de exclus\xE3o atualizado com sucesso"
          },
          "400": {
            description: "Erro ao excluir a tarefa"
          }
        }
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  }
};

// src/server.ts
var app = (0, import_express4.default)();
var PORT = 8080;
var apiVersion = "v1";
app.get(`/${apiVersion}`, function(req, res) {
  res.send("Hello World!");
});
app.use("/docs", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(swagger_default));
app.use(import_express4.default.json());
app.use(users_default);
app.use(projects_default);
app.use(task_default);
app.listen(PORT, () => console.log(`\u2728 Server started on ${PORT}`));
var server_default = app;
