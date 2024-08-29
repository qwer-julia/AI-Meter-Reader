import { Request, Response, NextFunction } from 'express';
import InvalidData from '../errors/InvalidData';
import DoubleReport from '../errors/DoubleReport';
import ConfirmationDuplicate from '../errors/ConfirmationDuplicate';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof InvalidData || DoubleReport || ConfirmationDuplicate) {
        res.status(err.statusCode).json({
            error_code: err.errorCode,
            error_description: err.message
        });
    }
    else {
        res.status(500).json({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: err.message
        });
    }
};

export default errorHandler;