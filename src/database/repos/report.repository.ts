import { PrismaClient } from '@prisma/client';
import { CreateReport, CreateReportComment, Report, ReportComment } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class ReportRepository {
    private prismaInstance: PrismaInstance;
    private prisma: PrismaClient;

    constructor() {
        this.prismaInstance = PrismaInstance.getInstance();
        this.prisma = this.prismaInstance.prisma;
    }

    async Create(report: CreateReport, identification: string): Promise<Report | null> {
        try {
            if (identification) {
                const employee = await this.prisma.employees.findFirst(({
                    where: {
                        identification
                    }
                }))
                if (!employee){
                    return null;
                }
                return await this.prisma.reports.create({
                  data: {...report, employeeId: employee?.id},
                  include: {
                    clients: true,
                    employees: true,
                  },
                });
            }
            
            return null;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<Report>, userId: number): Promise<Report | null> {
        try {
            const updated = await this.prisma.reports.update({
                where: {
                    id
                },
                data: dataToUpdate
            });
            return updated;
        } catch (error) {
            throw error;
        }
    }

    async GetAll(): Promise<Report[]> {
        try {
            return await this.prisma.reports.findMany({
              include: {
                laborAreas: true,
                clients: true,
                employees: true,
                reportPhotos: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            });
        } catch (error) {
            throw error;
        }
    }

    async GetAllOwnReports(userId: number): Promise<Report[]> {
        try {
            return await this.prisma.reports.findMany({
              where: {
                createdBy: userId,
              },
              include: {
                laborAreas: true,
                clients: true,
                employees: true,
                reportPhotos: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            });
        } catch (error) {
            throw error;
        }
    }

    async GetTop10ForClient(clientId: number): Promise<Report[]> {
        try {
          const clientReports = await this.prisma.reports.findMany({
            where: {
              clientId: clientId,
            },
            include: {
              laborAreas: true,
              clients: true,
              employees: true,
              reportPhotos: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          return clientReports;
        } catch (error) {
          throw error;
        }
    }

    async GetAllForClient(identification: string): Promise<Report[]> {
        try {
            const client = await this.prisma.clients.findFirst({
                where: {
                    identification
                }
            })

            if (!client) {
                return [];
            }

            const clientReports = await this.prisma.reports.findMany({
              where: {
                clientId: client.id,
              },
              include: {
                laborAreas: true,
                clients: true,
                employees: true,
                reportPhotos: true,
              },
              orderBy: {
                createdAt: "desc",
              }
            });
   
               return clientReports;

        } catch (error) {
            throw error;
        }
    }

    async GetAllForEmployee(identification: string): Promise<Report[]> {
        try {
            const employee = await this.prisma.employees.findFirst({
                where: { identification }
            })
            if (employee) {
                const clientEmployee = await this.prisma.clientEmployees.findFirst({
                  where: {
                    employeeId: employee.id,
                  },
                });
                
                if (clientEmployee) {
                    const client = await this.prisma.clients.findFirst({
                        where: {
                            id: clientEmployee.clientId
                        }
                    })

                    if (!client) {
                        return [];
                    }
                   const clientReports = await this.prisma.reports.findMany({
                     where: {
                         clientId: client.id,
                     },
                     include: {
                        laborAreas: true,
                        clients: true,
                        employees: true,
                        reportPhotos: true,
                     },
                     orderBy: {
                       createdAt: "desc",
                     }
                   });

                   return clientReports;
                }
            }       

            return [];
        } catch (error) {
            throw error;
        }
    }

    async GetLastFive(): Promise<Report[]> {
        try {
            return await this.prisma.reports.findMany({
                include: {
                    laborAreas: true,  
                    reportPhotos: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            });
        } catch (error) {
            throw error;
        }
    }

    async GetLastFiveForClient(identification: string): Promise<Report[]> {
        try {
            const client = await this.prisma.clients.findFirst({
                where: {
                    identification
                }
            })
            
            if (!client) {
                return [];
            }
           const clientReports = await this.prisma.reports.findMany({
             where: {
               clientId: client.id
             },
             include: {
               laborAreas: true,
               reportPhotos: true,
               clients: true,
             },
             orderBy: {
               createdAt: "desc",
             },
             take: 5,
           });

            return clientReports;
        } catch (error) {
            throw error;
        }
    }

    async GetLastFiveForEmployee(identification: string): Promise<Report[]> {
        try {
            const employee = await this.prisma.employees.findFirst({
                where: { identification }
            })

            if (employee) {
                const clientEmployee = await this.prisma.clientEmployees.findFirst({
                  where: {
                    employeeId: employee.id,
                  },
                });
                
                if (clientEmployee) {
                    const client = await this.prisma.clients.findFirst({
                        where: {
                            id: clientEmployee.clientId
                        }
                    })

                    if (!client) {
                        return [];
                    }
                   const clientReports = await this.prisma.reports.findMany({
                     where: {
                         clientId: client.id,
                     },
                     include: {
                       laborAreas: true,
                       reportPhotos: true,
                       clients: true,
                     },
                     orderBy: {
                       createdAt: "desc",
                     },
                     take: 5,
                   });

                   return clientReports;
                }
            }       

            return [];
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<Report | null> {
        try {
            return await this.prisma.reports.findFirst({
                where: { 
                    id
                },
                include: {
                    laborAreas: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async CreateReportComment(report: CreateReportComment): Promise<ReportComment | null> {
        try {
            const userEntry = await this.prisma.reportComments.create({
              data: report,
              include: {
                employees: true
              }
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async GetCommentsByReportId(id: number): Promise<ReportComment[] | null> {
        try {
            return await this.prisma.reportComments.findMany({
              where: {
                reportId: id,
              },
              include: {
                employees: true,
              },
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<Report | null> {
        try {
            const deleted = await this.prisma.reports.delete({
                where: {
                    id
                }
            });
            return deleted;
        } catch (error) {
            throw error;
        }
    }
}

export default ReportRepository;
