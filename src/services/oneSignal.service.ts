import { ONESIGNAL_API_KEY, ONESIGNAL_APP_ID } from "../config";
import { LaborAreaRepository } from "../database/repos";
import { FormateData } from "../utils";
import OneSignal from '@onesignal/node-onesignal'

const configuration = OneSignal.createConfiguration({
    userKey: ONESIGNAL_APP_ID,
    appKey: ONESIGNAL_API_KEY,
});

class OneSignalService {
  private repository: LaborAreaRepository;
  private client: OneSignal.DefaultApi;

  constructor() {
    this.repository = new LaborAreaRepository();
    this.client = new OneSignal.DefaultApi(configuration);
  }

  async CreateUser() {
    try {
     
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

export default OneSignalService;
