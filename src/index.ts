import { Elysia } from "elysia";
import { Logestic } from "logestic";
import { TodosRoutes } from "./modules/todos/todos.routes";
import { UsersRoutes } from "./modules/users/users.routes";
import { AuthRoutes } from "./modules/auth/auth.routes";

const app = new Elysia()
  .use(Logestic.preset("fancy"))
  .get('/', () => 'API is running')
  .use(AuthRoutes)
  .use(TodosRoutes)
  .use(UsersRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);