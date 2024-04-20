import { CreateAnnouncement } from "../database/models";
import { AnnouncementRepository } from "../database/repos";
import { FormateData } from "../utils";

class AnnouncementService {
  private repository: AnnouncementRepository;

  constructor() {
    this.repository = new AnnouncementRepository();
  }

  async Create(announcement: CreateAnnouncement) {
    try {
      return FormateData(await this.repository.Create(announcement));
    } catch (error) {
      throw error;
    }
  }

  async GetAll() {
    try {
      return FormateData(await this.repository.GetAll());
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number) {
    try {
      return FormateData(await this.repository.GetById(id));
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

export default AnnouncementService;
