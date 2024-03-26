export interface UserProfile {
    id: number;
    identificationId: number;
    profileId: number;
    isDeleted: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null
}