import { Connection } from '../entities/Connection';
import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService'
import { UsersService } from '../services/UsersService'
import { MessagesService } from '../services/MessagesService'

interface IParams {
    text: string,
    email: string
}

io.on('connect', (socket) => {

    const connectionsServices = new ConnectionsService();
    const usersService = new UsersService();
    const messagesService = new MessagesService();

    socket.on('client_first_access', async params => {
        const socket_id = socket.id;
        const { text, email } = params as IParams;
        let user_id = null;

        const userExist = await usersService.findByEmail(email);

        if (!userExist) {
            const user = await usersService.create(email);

            await connectionsServices.create({
                socket_id,
                user_id: user.id
            })

            user_id = user.id;
        } else {
            const connection = await connectionsServices.findByUserId(userExist.id);

            if (!connection) {
                await connectionsServices.create({
                    socket_id,
                    user_id: userExist.id
                })
            } else {
                connection.socket_id = socket_id;
                await connectionsServices.create(connection);
            }

            user_id = userExist.id;

        }

        await messagesService.create({
            text_ds: text,
            user_id: user_id
        });

        const allMessages = await messagesService.listByUser(user_id);

        socket.emit('client_list_all_mesages', allMessages);

        const allUsers = await connectionsServices.findAllWithoutAdmin();

        io.emit('admin_list_all_users', allUsers)
    });

    socket.on('client_send_to_admin', async params=> {
        const { msg, socket_admin_id } = params;

        const socket_id = socket.id;

        const {user_id} = await connectionsServices.findBySocketID(socket_id)

        const message = await messagesService.create({
            text_ds: msg,
            user_id
        });

        io.to(socket_admin_id).emit('admin_receive_message', {
            message,
            socket_id
        })
    })
});
