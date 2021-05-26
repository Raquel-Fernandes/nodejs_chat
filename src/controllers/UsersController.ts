import { Request, Response } from "express"
import { UsersService } from "../services/UsersService"


class UsersController {

    async create(request: Request, response: Response) {

        const { email } = request.body;

        const usersService = new UsersService();

        try {
            const user = await usersService.create(email);

            return response.json(user);
        } catch(err) {
            return response.status(400).json({
                message: err.message,
            })
        }

    }

    async findByEmail(request: Request, response: Response){

        const { id } = request.params;

        const messagesService = new UsersService();

        const list = await messagesService.findByEmail( id );

        return response.json(list);
    }
}

export { UsersController }