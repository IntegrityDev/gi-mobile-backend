export interface Profile {
    id: number;
    name: string;
    description?: string | null;
    createdAt: Date;
    createdBy: number;
}