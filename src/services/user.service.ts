import { User } from "../database/models";
import { UserRepository } from "../database/repos";

class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async CreateUser(user: User) {     
        try {
            const entityCreated = await this.repository.CreateUser(user);
            return entityCreated;
        } catch (error) {
            throw error;
        }
    }

//     async UpdateAlert(id: number, dataToUpdate: any, userId: number) {
//         try {
//             const entryUpdated = await this.repository.UpdateAlert(id, dataToUpdate, userId);
//             return FormateData(entryUpdated);
//         } catch (error) {
//             throw error;
//         }
//     }

//     async GetAllAlertsByUserId(userId: number) {
//         try {
//             return FormateData(await this.repository.GetAllAlertsByUserId(userId));
//         } catch (error) {
//             throw error;
//         }
//     }

//     async GetAlertById(id: number) {
//         try {
//             return FormateData(await this.repository.GetAlertById({ id }));
//         } catch (error) {
//             throw error;
//         }
//     }

//     async DeleteAlert({ id, userId }: { id: number, userId: number }) {
//         try {
//             const { id: idDeleted, title } = await this.repository.DeleteAlert({ id, userId });
//             return FormateData({ idDeleted, title });
//         } catch (error) {
//             throw error;
//         }
//     }
}

export default UserService;
