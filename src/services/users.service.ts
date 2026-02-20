import type { CreateUser, UpdateUser, User, UserRole } from "../types/users.types.js";
import { UsersRepository } from "../repositories/users.repository.js";
import bcrypt from 'bcrypt';
import { ApiError } from "../utils/api-error.js";
import { createTokensForUser, verifyToken } from "../utils/jwt-tokens.js";
import { TokensRepository } from "../repositories/tokens.repository.js";

export const SALT_ROUNDS = 12;

export async function createNewUser(user: CreateUser) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

    let { password, ...createdUser } = await UsersRepository.createUser(user) as User;

    return createdUser;
}

export async function signUpUser(user: CreateUser) {
    const createdUser = await createNewUser(user);
    const tokens = createTokensForUser(createdUser.id);

    TokensRepository.addToken(tokens.refreshToken);

    return { createdUser, ...tokens };
}

export async function signInUser(credentials: { email: string, password: string; }) {
    const user = await UsersRepository.getUser("email", credentials.email);

    if (!user)
        throw new ApiError(401, "Invalid email or password");

    if (!await bcrypt.compare(credentials.password, user.password))
        throw new ApiError(401, "Invalid email or password");

    const tokens = createTokensForUser(user.id);

    TokensRepository.addToken(tokens.refreshToken);

    return { user, ...tokens };
}

export async function signOutUser(refreshToken: string) {
    TokensRepository.deleteToken(refreshToken);
}

export function refreshUser(refresh_token: string) {
    const payload = verifyToken(refresh_token, 'refresh');

    return createTokensForUser(parseInt(payload.sub as string));
}

export async function updateUser(id: number, update: UpdateUser) {
    const updatedUser = await UsersRepository.updateUser(id, update);

    return updatedUser;
}