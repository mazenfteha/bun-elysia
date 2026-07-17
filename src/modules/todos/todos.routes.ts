import { Elysia, t } from "elysia";
import { TodosService } from './todos.service';

const todosService = new TodosService();

export const TodosRoutes = new Elysia({ prefix: '/todos' })
    .get('/', async () => await todosService.findAll())

    .get('/:id', async ({ params, set }) => {
        const todo = await todosService.findOne(Number(params.id));
        if (!todo) {
            set.status = 404;
            return { message: 'Todo not found' };
        }
        return todo;
    })

    .post(
        '/',
        async ({ body }) => await todosService.create(body),
        {
            body: t.Object({
                title: t.String({ minLength: 1, maxLength: 255 }),
                description: t.Optional(t.String()),
            }),
        }
    )

    .put(
        '/:id',
        async ({ params, body, set }) => {
            const updated = await todosService.update(Number(params.id), body);
            if (!updated) {
                set.status = 404;
                return { message: 'Todo not found' };
            }
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

    .delete('/:id', async ({ params, set }) => {
        const deleted = await todosService.delete(Number(params.id));
        if (!deleted) {
            set.status = 404;
            return { message: 'Todo not found' };
        }
        return { message: 'Deleted', id: params.id };
    });