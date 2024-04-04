import { PrismaClient } from "@prisma/client";
import { CreateVisit, Report, Visit } from "../models";

class VisitRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

 }

export default VisitRepository;
