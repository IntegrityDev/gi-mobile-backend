import { Profile } from "./profiles.interface";

export interface UserProfile {
    id: number;
    userId: number;
    profileId: number;
    isDeleted: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null
    profiles?: Profile | null;
}