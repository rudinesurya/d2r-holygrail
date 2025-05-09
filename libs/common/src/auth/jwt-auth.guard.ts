import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { UserDto } from '../dto';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Handle both HTTP and GraphQL contexts
    let req;
    if (context.getType() === 'http') {
      // HTTP context
      req = context.switchToHttp().getRequest();
    } else if (context.getType().toString() === 'graphql') {
      // GraphQL context
      const gqlContext = GqlExecutionContext.create(context).getContext();
      req = gqlContext.req;
    }

    if (!req) {
      throw new UnauthorizedException('Request object not found');
    }

    // Extract cookies or headers from the appropriate context
    const jwt =
      req.cookies?.authentication ||
      req.cookies?.Authentication ||
      req.headers?.authentication ||
      req.headers?.Authentication ||
      req.Authentication ||
      req.authentication;

    if (!jwt) {
      throw new UnauthorizedException('Authentication token not found');
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                this.logger.error('The user does not have valid roles.');
                throw new UnauthorizedException();
              }
            }
          }

          req.user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
