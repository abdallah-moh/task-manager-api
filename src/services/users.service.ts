import jwt from "jsonwebtoken";
import type { CreateUser, UpdateUser, User, UserRole } from "../types/users.types.js";
import { UsersRepository } from "../repositories/users.repository.js";
import bcrypt from 'bcrypt';
import { ApiError } from "../utils/api-error.js";

const SALT_ROUNDS = 12;
const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET || "This is supposed to be secret";

export function getTokenForUser(id: number, role: UserRole) {
    return jwt.sign(
        {
            id: id,
            role: role
        },
        AUTHORIZATION_TOKEN_SECRET,
        {
            expiresIn: "1h",
        }
    );
}

export async function createNewUser(user: CreateUser) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

    let { password, ...createdUser } = await UsersRepository.createUser(user) as User;

    return createdUser;
}

export async function signUpUser(user: CreateUser) {
    const createdUser = await createNewUser(user);
    const token = getTokenForUser(createdUser.id, createdUser.role);

    return { createdUser, token };
}

export async function signInUser(credentials: { email: string, password: string; }) {
    const user = await UsersRepository.getUser("email", credentials.email);

    if (!user)
        throw new ApiError(401, "Invalid email or password");

    if (!await bcrypt.compare(credentials.password, user.password))
        throw new ApiError(401, "Invalid email or password");

    const token = getTokenForUser(user.id, user.role);

    return { user, token };
}

export async function updateUser(id: number, update: UpdateUser) {
    const updatedUser = await UsersRepository.updateUser(id, update);

    return updatedUser;
}