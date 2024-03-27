import { Request, Response, NextFunction } from 'express';
import { ValidateSignature } from '../../utils';
import { STATUS_CODES } from '../../constants';

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAuthorized: boolean = await ValidateSignature(req);
        if (isAuthorized) {
            return next();
        }

        res.status(STATUS_CODES.UNAUTHORIZED).json({
            message: "Not Authorized"
        });
    } catch (error) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
            message: "Not Authorized"
        });
    }
}

export default AuthMiddleware;
