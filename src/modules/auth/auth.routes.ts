import { Elysia, t } from "elysia";
import { jwtPlugin } from "./auth.plugin";
import { AuthService } from "./auth.service";
import { UserService } from "../users/users.service";
import type { User } from "../../db/schema";

const authService = new AuthService();
const userService = new UserService();

// Whitelist what leaves the server. NEVER return passwordHash to a client.
const toPublicUser = (user: User) => ({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const AuthRoutes = new Elysia({ prefix: "/auth" })
    .use(jwtPlugin)
    .post(
        "/register",
        async ({ body, status }) => {
            const existing = await userService.findByEmail(body.email);
            if (existing) {
                return status(409, { message: "Email already registered" });
            }

            const user = await authService.register(body.email, body.password);
            return status(201, toPublicUser(user));
        },
        {
            body: t.Object({
                email: t.String({ minLength: 3, maxLength: 255 }),
                password: t.String({ minLength: 8, maxLength: 255 }),
            }),
        }
    )
    .post(
        "/login",
        async ({ body, jwt, status }) => {
            const user = await authService.validateCredentials(body.email, body.password);
            if (!user) {
                return status(401, { message: "Invalid credentials" });
            }

            // The token's `sub` claim carries the user id — that's the identity
            // the auth guard will read back out on protected routes.
            const token = await jwt.sign({ sub: String(user.id) });
            return { token, user: toPublicUser(user) };
        },
        {
            body: t.Object({
                email: t.String({ minLength: 3, maxLength: 255 }),
                password: t.String({ minLength: 1 }),
            }),
        }
    );
