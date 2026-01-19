import type { Request, Response } from "express";
import { loginUser, promoteAUser, registerUser } from "../services/users.service.js";


async function loginController(req: Request, res: Response) {
    let { email, password } = req.body;
    const { token } = await loginUser(email, password);

    res.json({
        accessToken: token
    });

}

async function registerController(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const { token } = await registerUser(email, password, name);

    res.json({
        accessToken: token
    });
}

function promoteController(req: Request<{ id: string; }>, res: Response) {
    promoteAUser("id", req.params.id);
    res.sendStatus(200);
}

export {
    loginController,
    registerController,
    promoteController
};