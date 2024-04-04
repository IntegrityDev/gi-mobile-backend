import { Request, Response, NextFunction } from 'express';
import { VisitService } from '../services'; 
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';


export default function setupVisitRoutes(app: any): void {
    
}
