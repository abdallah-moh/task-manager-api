export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    createdAt: Date;
}
