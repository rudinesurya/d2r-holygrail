import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UnverifiedItemException } from './unverified-item-exception';

@Catch(UnverifiedItemException)
export class UnverifiedItemExceptionFilter implements ExceptionFilter {
    catch(exception: UnverifiedItemException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(400).json({
            system_message: exception.message,
        });
    }
}