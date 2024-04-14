import TasksController from "../src/Controllers/TasksController";
import { Router } from "express";
import checkToken from "../src/service/token";
const tasksRouter = Router()

tasksRouter.post('/createtask', TasksController.createTask)
tasksRouter.post('/taskvizualize', checkToken, TasksController.taskVizualize)
tasksRouter.put('/taskconcluded', checkToken, TasksController.taskConcluded)
tasksRouter.put('/taskexcluded', checkToken, TasksController.taskDeleted)
export default tasksRouter