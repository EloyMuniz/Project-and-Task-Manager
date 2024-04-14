"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/Controllers/UserController.ts
var UserController_exports = {};
__export(UserController_exports, {
  default: () => UserController_default
});
module.exports = __toCommonJS(UserController_exports);
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
