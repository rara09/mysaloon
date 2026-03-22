import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('JWT Guard Error:', {
        err: err?.message,
        info: info?.message,
        user: user ? 'exists' : 'missing',
      });
      throw (
        err ||
        new UnauthorizedException(info?.message || 'Authentication failed')
      );
    }
    return user;
  }
}
