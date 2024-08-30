import { Request, Response, NextFunction } from 'express';
//erros
import InvalidData from '../errors/InvalidData';
import DoubleReport from '../errors/DoubleReport';
import ConfirmationDuplicate from '../errors/ConfirmationDuplicate';
import MeasureNotFound from '../errors/MeasureNotFound';
import MeasuresNotFound from '../errors/MeasuresNotFound';
import InvalidType from '../errors/InvalidType';

function isValidationError(err: Error) {
    return [InvalidData, DoubleReport, ConfirmationDuplicate, MeasureNotFound, InvalidType, MeasuresNotFound].some(errorClass => err instanceof errorClass);
}
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (isValidationError(err)) {
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