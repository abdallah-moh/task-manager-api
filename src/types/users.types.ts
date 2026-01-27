export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface CreateUser {
    name: string,
    email: string,
    password: string,
    role: UserRole,
}
export interface UpdateUser {
    name?: string,
    email?: string,
    password?: string,
    role?: UserRole;
}

export interface User extends CreateUser {
    id: number,
    createdAt: Date;
}
