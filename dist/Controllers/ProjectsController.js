"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/Controllers/ProjectsController.ts
var ProjectsController_exports = {};
__export(ProjectsController_exports, {
  default: () => ProjectsController_default
});
module.exports = __toCommonJS(ProjectsController_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var ProjectsController = class {
  //API para criar um novo projeto
  createProject(req, res) {
    return __async(this, null, function* () {
      try {
        const { use_uuid, project_name, project_description } = req.body;
        const name = yield prisma.project.findFirst({
          where: { project_name }
        });
        if (name) {
          return res.status(409).json({ message: "O nome do projeto j\xE1 existe." });
        }
        yield prisma.project.create({
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
        const result = yield prisma.project.findMany({
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
