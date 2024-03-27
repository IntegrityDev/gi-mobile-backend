import { User } from "../database/models";
import { UserRepository } from "../database/repos";
import { FormateData } from "../utils";

class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async CreateUser(user: User) {     
        try {
            const entityCreated = await this.repository.CreateUser(user);
            return FormateData(entityCreated);
        } catch (error) {
            throw error;
        }
    }

    async UpdateUser(id: number, dataToUpdate: any, userId: number) {
        try {
            const entryUpdated = await this.repository.UpdateUser(id, dataToUpdate, userId);
            return FormateData(entryUpdated);
        } catch (error) {
            throw error;
        }
    }

    async GetAllUsers(userId: number) {
        try {
            return FormateData(await this.repository.GetAllUsers());
        } catch (error) {
            throw error;
        }
    }

    async GetUserById(id: number) {
        try {
            return FormateData(await this.repository.GetUserById(id));
        } catch (error) {
            throw error;
        }
    }

    async Delete({ id, userId }: { id: number, userId: number }) {
        try {
            const data = await this.repository.DeleteUser(id, userId);
            return FormateData(data);
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
