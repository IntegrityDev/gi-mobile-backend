import { LaborAreaRepository } from "../database/repos";
import { FormateData } from "../utils";

class LaborAreaService {
  private repository: LaborAreaRepository;

  constructor() {
    this.repository = new LaborAreaRepository();
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

export default LaborAreaService;
