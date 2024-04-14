import express from "express";
import UserController from "./Controllers/UserController";
import ProjectsController from "../src/Controllers/ProjectsController";
import usersRouter from "../routes/users";
import projectRouter from "../routes/projects";
import tasksRouter from "../routes/task";
import swaggerUi from "swagger-ui-express"
import swaggerDocs from "./swagger.json"
var app = express();
const PORT = 8080

const apiVersion = "v1";
app.get(`/${apiVersion}`, function (req, res) {
    res.send('Hello World!');
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(express.json());
app.use(usersRouter)
app.use(projectRouter)
app.use(tasksRouter)

app.listen(PORT, () =>
    console.log(`✨ Server started on ${PORT}`));
export default app