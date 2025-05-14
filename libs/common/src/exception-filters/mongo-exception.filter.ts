import { ExceptionFilter, Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        if (exception.code === 11000) {
            // Handle duplicate key error
            response.status(409).json({
                message: 'A record with the same unique field already exists.',
                details: exception.keyValue, // Include the conflicting key-value pair
            });
        } else {
            // Handle other MongoDB errors (optional)
            response.status(500).json({
                message: 'An unexpected database error occurred.',
            });
        }
    }
}