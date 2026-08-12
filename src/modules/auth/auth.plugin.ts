import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

// Shared JWT instance. It is reused by the login route (to *sign* tokens)
export const jwtPlugin = jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET!,
    exp: "7d",
});

// authGuard: mount on any route group that requires a logged-in user.

export const authGuard = new Elysia({ name: "auth-guard" })
    .use(jwtPlugin)
    .resolve({ as: "scoped" }, async ({ jwt, headers, status }) => {
        const authHeader = headers.authorization;

        // Expect: `Authorization: Bearer <token>`
        if (!authHeader?.startsWith("Bearer ")) {
            return status(401, { message: "Missing or malformed Authorization header" });
        }

        const token = authHeader.slice("Bearer ".length);
        const payload = await jwt.verify(token);

        // jwt.verify returns `false` on an invalid/expired/tampered token.
        if (!payload || typeof payload.sub !== "string") {
            return status(401, { message: "Invalid or expired token" });
        }

        // Returning this object merges `userId` into the downstream context.
        return { userId: Number(payload.sub) };
    });
