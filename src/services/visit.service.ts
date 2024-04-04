import { CreateVisit, Report, Visit } from "../database/models";
import { VisitRepository } from "../database/repos";
import { FormateData } from "../utils";

class VisitService {
    private repository: VisitRepository;

    constructor() {
        this.repository = new VisitRepository();
    }
}

export default VisitService;
