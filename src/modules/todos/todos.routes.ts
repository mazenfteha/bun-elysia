import { Elysia, t } from "elysia";
import { TodosService } from "./todos.service";
import { authGuard } from "../auth/auth.plugin";

const todosService = new TodosService();

// `.use(authGuard)` makes every route below protected: the scoped resolve
// runs first, rejects anonymous requests with 401, and injects `userId`
// into each handler's context.
export const TodosRoutes = new Elysia({ prefix: "/todos" })
    .use(authGuard)

    .get("/", async ({ userId }) => await todosService.findAll(userId))

    .get("/:id", async ({ params, userId, status }) => {
        const todo = await todosService.findOne(Number(params.id), userId);
        if (!todo) return status(404, { message: "Todo not found" });
        return todo;
    })

    .post(
        "/",
        // userId comes from the token, NOT the request body — a client can't
        // create a todo owned by someone else.
        async ({ body, userId }) => await todosService.create({ ...body, userId }),
        {
            body: t.Object({
                title: t.String({ minLength: 1, maxLength: 255 }),
                description: t.Optional(t.String()),
            }),
        }
    )

    .put(
        "/:id",
        async ({ params, body, userId, status }) => {
            const updated = await todosService.update(Number(params.id), userId, body);
            if (!updated) return status(404, { message: "Todo not found" });
            return updated;
        },
        {
            body: t.Object({
                title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
                description: t.Optional(t.String()),
                completed: t.Optional(t.Boolean()),
            }),
        }
    )

    .delete("/:id", async ({ params, userId, status }) => {
        const deleted = await todosService.delete(Number(params.id), userId);
        if (!deleted) return status(404, { message: "Todo not found" });
        return { message: "Deleted", id: params.id };
    });
