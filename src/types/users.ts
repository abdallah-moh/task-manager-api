enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    createdAt: Date;
}

export { type User, UserRole };