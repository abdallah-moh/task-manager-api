import { UserRole, type User } from "../types/users.types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET || "secret";

let users: User[] = [];

function checkUserExists(key: 'id' | 'email', value: string) {
    return getUser(key, value) != null;
}

function getUser(key: 'id' | 'email', value: string) {
    return users.find((user) => {
        return user[key] === value;
    });
}

function getAllUsers() {
    return users;
}

async function createNewUser(email: string, password: string, name: string) {
    if (checkUserExists('email', email)) {
        return null;
    }

    let user: User = {
        id: crypto.randomUUID(),
        name,
        email,
        password: await bcrypt.hash(password, 10),
        createdAt: new Date(Date.now()),
        role: users.length === 0 ? UserRole.ADMIN : UserRole.USER
    };

    users.push(user);
    return user;
}


async function loginUser(email: string, password: string) {
    let user = getUser("email", email);

    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    let token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        AUTHORIZATION_TOKEN_SECRET,
        {
            expiresIn: "1h",
        }
    );

    return { token };
}

async function registerUser(email: string, password: string, name: string) {
    let user = await createNewUser(email, password, name);

    if (!user) {
        throw new ApiError(409, "Invalid credentials");
    }

    let token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        AUTHORIZATION_TOKEN_SECRET,
        {
            expiresIn: "1h",
        }
    );
    return { token };
}

function promoteAUser(key: 'id' | 'email', value: string) {
    let user = getUser(key, value);

    if (!user) {
        throw new ApiError(404, "A user with this ID doesn't exist");
    }

    let index = users.indexOf(user);
    if (index !== -1) {
        users[index] = { ...users[index], role: UserRole.ADMIN } as User;
    }
}

export { checkUserExists, createNewUser, getUser, getAllUsers, promoteAUser, loginUser, registerUser };