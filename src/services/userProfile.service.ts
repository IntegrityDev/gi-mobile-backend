import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import { UserProfileRepository } from "../database/repos";
import { FormateData } from "../utils";

class UserProfileService {
    private repository: UserProfileRepository;

    constructor() {
        this.repository = new UserProfileRepository();
    }

    async Create(userId: number, profileId: number, createdBy: number) {     
        try {
            const existsUserProfile = await this.repository.GetByUserIdAndProfileId(userId, profileId);
            if (existsUserProfile) {
                return FormateData({ 
                    message: RESPONSE_MESSAGES.USER_PROFILE_EXISTS, 
                    statusCode: STATUS_CODES.BAD_REQUEST 
                });
            }
            const entityCreated = await this.repository.Create(userId, profileId, createdBy);
            return FormateData(entityCreated);
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number) {
        try {
            const data = await this.repository.Delete(id, userId);
            return FormateData(data);
        } catch (error) {
            throw error;
        }
    }
}

export default UserProfileService;
