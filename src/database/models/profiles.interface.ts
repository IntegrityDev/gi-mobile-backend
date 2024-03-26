export interface Profile {
    id: number;
    name: string;
    description?: string | null;
    isSupervisor: boolean;
    isAdmin: boolean;
    isSysAdmin: boolean;
    createdAt: Date;
    createdBy: number;
}