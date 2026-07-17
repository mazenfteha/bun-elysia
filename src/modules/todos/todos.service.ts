import { eq } from "drizzle-orm";
import { db } from "../../db";
import { todos, Todo, NewTodo } from "../../db/schema";

export class TodosService {
    async findAll(): Promise<Todo[]> {
        const tasks = await db.select().from(todos);
        return tasks;
    }

    async findOne(id: number): Promise<Todo | null> {
        const task = await db.select().from(todos).where(eq(todos.id, id)).then((rows) => rows[0] || null);
        return task;
    }

    async create(todo: NewTodo): Promise<Todo> {
        const newTask = await db.insert(todos).values(todo).returning().then((rows) => rows[0]);
        return newTask;
    }

    async update(id: number, todo: Partial<NewTodo>): Promise<Todo | null> {
        const updatedTask = await db.update(todos).set(todo).where(eq(todos.id, id)).returning().then((rows) => rows[0] || null);
        return updatedTask;
    }

    async delete(id: number): Promise<boolean> {
        const deletedTask = await db.delete(todos).where(eq(todos.id, id)).returning().then((rows) => rows[0] !== undefined);
        return deletedTask;
    }
}