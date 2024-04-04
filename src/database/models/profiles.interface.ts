export interface Profile {
    id: number;
    name: string;
    description?: string | null;
    isSupervisor: boolean;
    isAdmin: boolean;
    isClient: boolean;
    isSysAdmin: boolean;
    createdAt: Date;
    createdBy: number;
}