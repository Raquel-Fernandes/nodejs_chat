import { Router } from "express";
import { MessagesController } from "./controllers/MessagesController";
import { Settingscontroller } from "./controllers/SettingsController";
import { UsersController } from "./controllers/UsersController";

const routes = Router();

const settingscontroller = new Settingscontroller();

const usersController = new UsersController();

const messagesController = new MessagesController();

routes.post('/settings', settingscontroller.create);
routes.get('/settings/:user', settingscontroller.findByUser)
routes.put('/settings/:username', settingscontroller.update)

routes.post('/users', usersController.create);
routes.get('/users/:id', usersController.findByEmail)


routes.post('/messages', messagesController.create);
routes.get('/messages/:id', messagesController.showByUser)

export { routes };