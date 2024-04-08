import { PrismaClient } from "@prisma/client";
import PrismaInstance from "../../utils/PrismaInstance";

class VisitRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

 }

export default VisitRepository;