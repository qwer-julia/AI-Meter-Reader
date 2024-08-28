import { Request, Response, NextFunction } from 'express';
import InvalidDataError from '../errors/InvalidData';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof InvalidDataError) {
        res.status(err.statusCode).json({
            error_code: err.errorCode,
            error_description: err.message
        });
    } else {
        res.status(500).json({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: err.message
        });
    }
};

export default errorHandler;