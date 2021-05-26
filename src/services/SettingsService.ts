import { getCustomRepository, Repository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository"
import { Setting } from "../entities/Setting"
interface ISettingsCreate {
    chat: boolean;
    username: string;
}


class SettingsService {

    private settingsRepository: Repository<Setting>;

    constructor() {
        this.settingsRepository = getCustomRepository(SettingsRepository);

    }
    async create({ chat, username }: ISettingsCreate) {

        const userAlredyExist = await this.settingsRepository.findOne({
            username
        });

        if (userAlredyExist) {
            throw new Error("User alredy exist");
        }

        const settings = this.settingsRepository.create({
            chat,
            username
        });

        await this.settingsRepository.save(settings);

        return settings;
    }

    async findByUser(user: string){
        const userExists = await this.settingsRepository.find({
            where:{
                username: user,
                chat: true
            }
        })

        if(userExists){
            return userExists;
        }

    }

    async update(username: string, chat: boolean) {
        await this.settingsRepository.createQueryBuilder()
            .update(Setting)
            .set({ chat })
            .where('username = :username', {
                username: username
            }).execute()
    }
}

export { SettingsService }