import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { todos, Todo, NewTodo } from "../../db/schema";

// Every query is scoped by userId. This is where ownership is *enforced*:
// a user can only ever touch rows where todos.userId matches their own id.
// A non-owner asking for someone else's todo simply gets "no rows" -> 404,
// which also avoids leaking whether that id exists at all.
export class TodosService {
    async findAll(userId: number): Promise<Todo[]> {
        return db.select().from(todos).where(eq(todos.userId, userId));
    }

    async findOne(id: number, userId: number): Promise<Todo | null> {
        return db
            .select()
            .from(todos)
            .where(and(eq(todos.id, id), eq(todos.userId, userId)))
            .then((rows) => rows[0] || null);
    }

    async create(todo: NewTodo): Promise<Todo> {
        return db.insert(todos).values(todo).returning().then((rows) => rows[0]);
    }

    async update(id: number, userId: number, todo: Partial<NewTodo>): Promise<Todo | null> {
        return db
            .update(todos)
            .set({ ...todo, updatedAt: new Date() })
            .where(and(eq(todos.id, id), eq(todos.userId, userId)))
            .returning()
            .then((rows) => rows[0] || null);
    }

    async delete(id: number, userId: number): Promise<boolean> {
        return db
            .delete(todos)
            .where(and(eq(todos.id, id), eq(todos.userId, userId)))
            .returning()
            .then((rows) => rows[0] !== undefined);
    }
}
