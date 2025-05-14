import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const token =
            request?.Authentication ||
            request?.authentication ||
            request?.cookies?.Authentication ||
            request?.cookies?.authentication ||
            request?.headers?.Authentication ||
            request?.headers?.authentication; 
          console.log('Extracted JWT:', token);
          return token;
        }
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    console.log(`userid: ${userId}`);
    return this.usersService.getUser({ _id: userId });
  }
}
