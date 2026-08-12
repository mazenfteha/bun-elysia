import { Elysia, t } from "elysia";
import { UserService } from './users.service';

const userService = new UserService();

export const UsersRoutes = new Elysia({ prefix: '/users' })
    .get('/', async () => await userService.findAll())

    .get('/:id', async ({ params, set }) => {
        const user = await userService.findOne(Number(params.id));
        if (!user) {
            set.status = 404;
            return { message: 'User not found' };
        }
        return user;
    })

    .get('/email/:email', async ({ params, set }) => {
        const user = await userService.findByEmail(params.email);
        if (!user) {
            set.status = 404;
            return { message: 'User not found' };
        }
        return user;
    })

    .post(
        '/',
        async ({ body }) => await userService.create(body),
        {
            body: t.Object({
                email: t.String({ minLength: 1, maxLength: 255 }),
                passwordHash: t.String({ minLength: 1 }),
            }),
        }  
    )

    .put(
        '/:id',
        async ({ params, body, set }) => {
            const updated = await userService.update(Number(params.id), body);
            if (!updated) {
                set.status = 404;
                return { message: 'User not found' };
            }
            return updated;
        },
        {
            body: t.Object({                
                email: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
                passwordHash: t.Optional(t.String({ minLength: 1 })),
            }),
        }
    )

    .delete('/:id', async ({ params, set }) => {
        const deleted = await userService.delete(Number(params.id));
        if (!deleted) {
            set.status = 404;
            return { message: 'User not found' };
        }
        return { message: 'Deleted', id: params.id };
    }); 