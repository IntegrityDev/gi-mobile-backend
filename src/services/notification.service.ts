import { NotificationRepository } from "../database/repos";
import { FormateData } from "../utils";

class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  async GetAll(identification: string) {
    try {
      return FormateData(await this.repository.GetAll(identification));
    } catch (error) {
      throw error;
    }
  }

  async GetTops(identification: string) {
    try {
      return FormateData(await this.repository.GetTops(identification));
    } catch (error) {
      throw error;
    }
  }

  async GetLast(identification: string) {
    try {
      return FormateData(await this.repository.GetLast(identification));
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

  async ReadNotification(id: number) {
    try {
      const data = await this.repository.ReadNotification(id);
      return FormateData(data);
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

export default NotificationService;
