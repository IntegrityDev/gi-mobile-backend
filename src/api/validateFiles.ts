import { Request, Response, NextFunction } from "express";
import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import AuthMiddleware from "./middlewares/auth";
import { CustomRequest } from "../database/models";
import { ClientService, EmployeeService } from "../services";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const upload = multer({ dest: "uploads/" });
const service = new EmployeeService();
const clientService = new ClientService();

export default function setupValidateFilesRoutes(app: any): void {
  app.post(
    "/validate-files/employees",
    AuthMiddleware,
    upload.single("csvFile"),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).send("No se proporcionó ningún archivo CSV.");
        }
        const { id: createdBy } = req.user as { id: number };
        const csvFilePath = req.file.path;
        const results: any[] = [];
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on("data", (data: any) => results.push(data))
          .on("end", async () => {
            for (const employee of results) {
              const { data: existsEmployee } = await service.ValidateEmployee(
                employee.identification
              );
              if (existsEmployee) {
                employee.isValid = false;
                employee.message =
                  "El empleado se encuentra en la base de datos con esta identificación";
              } else {
                employee.createdBy = createdBy;
                employee.isSupervisor = false;
                employee.isActive = true;
                employee.isValid = true;
                employee.message = "Empleado válido para guardar";
              }
            }
            res.status(200).json(results);
          });

      } catch (error) {
        console.error("Error en el servidor:", error);
        return res
          .status(STATUS_CODES.INTERNAL_ERROR)
          .json({ message: RESPONSE_MESSAGES.ERROR_500 });
      }
    }
  );

  app.post(
    "/validate-files/supervisors",
    AuthMiddleware,
    upload.single("csvFile"),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).send("No se proporcionó ningún archivo CSV.");
        }
        const { id: createdBy } = req.user as { id: number };
        const csvFilePath = req.file.path;
        const results: any[] = [];
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on("data", (data: any) => results.push(data))
          .on("end", async () => {
            for (const employee of results) {
              const { data: existsEmployee } = await service.ValidateEmployee(
                employee.identification
              );
              if (existsEmployee) {
                employee.isValid = false;
                employee.message =
                  "El supervisor se encuentra en la base de datos con esta identificación";
              } else {
                employee.createdBy = createdBy;
                employee.isSupervisor = true;
                employee.isActive = true;
                employee.isValid = true;
                employee.message = "Supervisor válido para guardar";
              }
            }
            res.status(200).json(results);
          });

      } catch (error) {
        console.error("Error en el servidor:", error);
        return res
          .status(STATUS_CODES.INTERNAL_ERROR)
          .json({ message: RESPONSE_MESSAGES.ERROR_500 });
      }
    }
  );

  app.post(
    "/validate-files/clients",
    AuthMiddleware,
    upload.single("csvFile"),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).send("No se proporcionó ningún archivo CSV.");
        }
        const { id: createdBy } = req.user as { id: number };
        const csvFilePath = req.file.path;
        const results: any[] = [];
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on("data", (data: any) => results.push(data))
          .on("end", async () => {
            for (const client of results) {
              const { data: existsClient } =
                await clientService.ValidateClient(client.identification);
              if (existsClient) {
                client.isValid = false;
                client.message =
                  "El cliente se encuentra en la base de datos con esta identificación";
              } else {
                client.createdBy = createdBy;
                client.isActive = true;
                client.isValid = true;
                client.message = "Cliente válido para guardar";
              }
            }
            res.status(200).json(results);
          });

      } catch (error) {
        console.error("Error en el servidor:", error);
        return res
          .status(STATUS_CODES.INTERNAL_ERROR)
          .json({ message: RESPONSE_MESSAGES.ERROR_500 });
      }
    }
  );
}
