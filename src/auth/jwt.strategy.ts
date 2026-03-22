import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

const ACCESS_TOKEN_COOKIE = 'access_token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || 'your-secret-key';

    // Log en développement pour déboguer
    if (process.env.NODE_ENV !== 'production') {
      console.log('JWT Strategy initialized with secret:', jwtSecret ? '***SET***' : '***NOT SET***');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[ACCESS_TOKEN_COOKIE],
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      if (!payload || !payload.sub) {
        console.error('JWT Validation Error: Invalid payload', payload);
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.authService.validateUser(payload.sub);
      if (!user) {
        console.error('JWT Validation Error: User not found', payload.sub);
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        console.error('JWT Validation Error: User inactive', payload.sub);
        throw new UnauthorizedException('User is inactive');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('JWT Validation Error:', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}

