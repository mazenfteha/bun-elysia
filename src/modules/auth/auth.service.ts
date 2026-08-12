import { UserService } from "../users/users.service";
import type { User } from "../../db/schema";

export class AuthService {
    private userService = new UserService();

    async register(email: string, password: string): Promise<User> {
        const passwordHash = await Bun.password.hash(password);
        return this.userService.create({ email, passwordHash });
    }

    async validateCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const valid = await Bun.password.verify(password, user.passwordHash);
        return valid ? user : null;
    }
}
