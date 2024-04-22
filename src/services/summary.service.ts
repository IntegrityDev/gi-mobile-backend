import { SummaryRepository } from "../database/repos";
import { FormateData } from "../utils";

class SummaryService {
  private repository: SummaryRepository;

  constructor() {
    this.repository = new SummaryRepository();
  }

  async GetAll() {
    try {
      return FormateData(await this.repository.getMonthlyReportStatus());
    } catch (error) {
      throw error;
    }
  }

  async GetCounts() {
    try {
      return FormateData(await this.repository.GetCounts());
    } catch (error) {
      throw error;
    }
  }
}

export default SummaryService;
