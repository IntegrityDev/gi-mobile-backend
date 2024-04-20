export interface Announcement {
  id: number;
  createdAt: Date;
  imageUrl: string;
  forPublic: string;
}
  
  export interface CreateAnnouncement extends Omit<Announcement, 'id' | 'createdAt'> {
    
  }