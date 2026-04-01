import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const ACCESS_TOKEN_COOKIE = 'access_token';

function accessTokenCookieBase() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/' as const,
  };
}

function accessTokenCookieOptions() {
  return {
    ...accessTokenCookieBase(),
    maxAge: 24 * 60 * 60 * 1000,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res,
  ) {
    const result = await this.authService.register(registerDto);
    const { access_token, ...user } = result;
    res.cookie(ACCESS_TOKEN_COOKIE, access_token, accessTokenCookieOptions());
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const { access_token, user } = await this.authService.login(loginDto);
    res.cookie(ACCESS_TOKEN_COOKIE, access_token, accessTokenCookieOptions());

    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE, accessTokenCookieBase());
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    const { id, email, firstName, lastName, role } = req.user;
    return { id, email, firstName, lastName, role };
  }
}
