import UserController from "../src/Controllers/UserController";
import { Router } from "express";
import checkToken from "../src/service/token";
const usersRouter = Router()

usersRouter.post('/register', UserController.registerUsers)
usersRouter.post('/login', UserController.login)
usersRouter.post(`/sendemail`, UserController.sendEmail)
usersRouter.post(`/password-recovery`, UserController.passwordRecover)
export default usersRouter