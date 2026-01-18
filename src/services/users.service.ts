import { UserRole, type User } from "../types/users.js";
import bcrypt from "bcrypt";

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

function promoteAUser(key: 'id' | 'email', value: string) {
    let user = getUser(key, value);
    if (!user) {
        throw new Error("A user with this ID doesn't exist");
    }
    let index = users.indexOf(user);
    // @ts-ignore
    users[index].role = UserRole.ADMIN;
}

export { checkUserExists, createNewUser, getUser, getAllUsers, promoteAUser };