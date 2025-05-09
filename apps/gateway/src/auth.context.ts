import { AUTH_SERVICE } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { app } from './app';

export const authContext = async ({ req }) => {
    try {
        // Extract the cookie header
        const cookies = req.headers?.cookie || '';

        // Parse the cookies to find the Authentication token
        const jwt = cookies
            .split(';')
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.toLowerCase().startsWith('authentication='))
            ?.split('=')[1];

        if (!jwt) {
            throw new UnauthorizedException('Authentication token not found');
        }

        const authClient = app.get<ClientProxy>(AUTH_SERVICE);
        const user = await lastValueFrom(
            authClient.send('authenticate', {
                Authentication: jwt,
            }),
        );
        
        return { user };
    } catch (err) {
        throw new UnauthorizedException(err.message || 'Unauthorized');
    }
};