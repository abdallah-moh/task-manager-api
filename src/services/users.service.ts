import { UserRole, type User } from "../types/users.js";
import bcrypt from "bcrypt";

let users: User[] = [];

function checkUserExists(email: string) {
    return getUser(email) != null;
}

function getUser(email: string) {
    return users.find((user) => {
        return user.email === email;
    });
}
function getAllUsers() {
    return users;
}

async function createNewUser(email: string, password: string, name: string) {
    if (checkUserExists(email)) {
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

export { checkUserExists, createNewUser, getUser, getAllUsers };