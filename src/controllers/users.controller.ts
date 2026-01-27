import type { Request, Response } from "express";
import { signUpUser, signInUser, updateUser } from "../services/users.service.js";
import { UserRole, type CreateUser } from "../types/users.types.js";
import { UsersRepository } from "../repositories/users.repository.js";


export async function signUpController(req: Request, res: Response) {
    const { email, password, name } = req.body as CreateUser;

    // Make the first ever user and ADMIN
    const role = (await UsersRepository.getAllUsers()).length === 0 ? UserRole.ADMIN : UserRole.USER;

    const { token } = await signUpUser({ email, password, name, role });

    res.json({
        accessToken: token
    });
}

export async function signInController(req: Request, res: Response) {
    let { email, password } = req.body as { email: string, password: string; };
    const { token } = await signInUser({ email, password });

    res.json({
        accessToken: token
    });

}

export async function promoteController(req: Request, res: Response) {
    const id = parseInt(req.params.id as string);
    const updatedUser = await updateUser(id, { role: UserRole.ADMIN });

    res.status(200).json(updatedUser);
}
