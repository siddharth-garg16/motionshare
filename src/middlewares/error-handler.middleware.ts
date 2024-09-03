import { Request, Response, NextFunction } from 'express';
import { errors } from '../constants/errors.constant';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case errors.VALIDATION_ERROR:
            res.json({ title: "Validation Failed", message: err.message, stackTrace: err.stack });
            break;

        case errors.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace: err.stack });
            break;

        case errors.UNAUTHORIZED:
            res.json({ title: "Unauthorized", message: err.message, stackTrace: err.stack });
            break;

        case errors.FORBIDDEN:
            res.json({ title: "Forbidden", message: err.message, stackTrace: err.stack });
            break;

        case errors.SERVER_ERROR:
            res.json({ title: "Internal Server Error", message: err.message, stackTrace: err.stack });
            break;

        default:
            console.log("No Error");
            break;
    }

}

export { errorHandler }