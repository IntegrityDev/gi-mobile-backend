import { User, CreateUser, ListUser, UserEmployee } from "./user.interface";
import { Profile } from "./profiles.interface";
import { UserProfile } from "./userProfile.interface";
import { ClientRequestResponse } from "./clientRequestResponse";
import { Client, CreateClient, UpdateClient } from "./client.interface";
import { ClientRequest } from "./clientRequest.interface";
import { Company } from "./company.interface";
import { DocumentType } from "./documentType.interface";
import { EmployeeRequestComment } from "./employeeRequestComment";
import { EmployeeRequest } from "./employeeRequest.interface";
import { Employee, CreateEmployee, UpdateEmployee } from "./employee.interface";
import { ReportCommentPhoto } from "./reportCommentPhoto.interface";
import { ReportComment } from "./reportComment.interface";
import { ReportPhoto } from "./reportPhoto.interface";
import { Report } from "./report.interface";
import { Visit, CreateVisit, UpdateVisit } from "./visit.interface";
import { CustomRequest } from "./customRequest.interface";
import { CustomError } from "./customError.interface";
import { ClientEmployee, CreateClientEmployee } from "./clientEmployee.interface";

export {
    CustomRequest,
    User,
    CreateUser,
    ListUser,
    UserEmployee,
    Profile,
    UserProfile,
    ClientRequestResponse,
    Client,
    CreateClientEmployee,
    CreateClient,
    UpdateClient,
    ClientRequest,
    Company,
    DocumentType,
    Employee,
    CreateEmployee,
    UpdateEmployee,
    EmployeeRequestComment,
    EmployeeRequest,
    Report,
    ReportCommentPhoto,
    ReportComment,
    ReportPhoto,
    Visit,
    CreateVisit,
    UpdateVisit,
    CustomError,
    ClientEmployee
}