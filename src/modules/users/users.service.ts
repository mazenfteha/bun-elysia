import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, User, NewUser } from "../../db/schema";

export class UserService {
    async findAll(): Promise<User[]> {
        const usersList = await db.select().from(users);
        return usersList;
    }


    async findOne(id: number): Promise<User | null> {
        const user = await db.select().from(users).where(eq(users.id, id)).then((rows) => rows[0] || null);
        if(!user) throw new Error (`User with id ${id} not found`);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
    const user = await db.select().from(users)
        .where(eq(users.email, email))
        .then((rows) => rows[0] || null);
        return user;
    }

    async create(user: NewUser): Promise<User> {
        const newUser = await db.insert(users).values(user).returning().then((rows) => rows[0]);
        return newUser;
    }

    async update(id: number, user: Partial<NewUser>): Promise<User | null> {
        const updatedUser = await db.update(users).set(user).where(eq(users.id, id)).returning().then((rows) => rows[0] || null);
        return updatedUser;
    }

    async delete(id: number): Promise<boolean> {
        const deletedUser = await db.delete(users).where(eq(users.id, id)).returning().then((rows) => rows[0] !== undefined);
        return deletedUser;
    }
}