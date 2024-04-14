"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/Controllers/TasksController.ts
var TasksController_exports = {};
__export(TasksController_exports, {
  default: () => TasksController_default
});
module.exports = __toCommonJS(TasksController_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var TasksController = class {
  createTask(req, res) {
    return __async(this, null, function* () {
      try {
        const { task_description, task_title, task_date_conclude, project_uuid } = req.body;
        const result = yield prisma.task.findFirst({
          where: { task_title }
        });
        if (result && result.task_title) {
          return res.status(409).json({ message: "J\xE1 existe uma tarefa de mesmo nome!" });
        }
        yield prisma.task.create({
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
        const result = yield prisma.task.findMany({
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
        yield prisma.task.update({
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
        yield prisma.task.update({
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
