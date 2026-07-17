import { Elysia } from "elysia";
import { Logestic } from "logestic";
import { TodosRoutes } from "./modules/todos/todos.routes";

const app = new Elysia()
  .use(Logestic.preset("fancy"))
  .get('/', () => 'API is running')
  .use(TodosRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
