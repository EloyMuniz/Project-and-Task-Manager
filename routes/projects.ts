import ProjectsController from "../src/Controllers/ProjectsController";
import { Router } from "express";
import checkToken from "../src/service/token";



const projectRouter = Router()


projectRouter.post('/createproject', checkToken, ProjectsController.createProject)
projectRouter.post('/projectvizualize', checkToken, ProjectsController.projectVizualize)
export default projectRouter