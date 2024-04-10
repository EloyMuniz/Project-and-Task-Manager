import UserController from "../src/Controllers/UserController";
import { Router } from "express";

const usersRouter = Router()

usersRouter.post('/register', UserController.registerUsers)

export default usersRouter