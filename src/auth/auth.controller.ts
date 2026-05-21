import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/role.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Response } from 'express';


// 🔹 Type for current user
interface JwtUser {
  sub: number;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // 🔹 Register
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req) {
    const { accessToken, refreshToken } =
      await this.authService.login(dto);

    req.res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    req.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return { message: 'Login successful' };
  }

  // 🔹 Current User
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: JwtUser) {
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    };
  }

  // 🔹 Refresh Token
  @Post('refresh')
  async refresh(@Req() req, @Res() res: Response) {
    const token = req.cookies?.refreshToken;

    const { accessToken, refreshToken } =
      await this.authService.refresh(token);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return res.json({ message: 'Refreshed' });
  }

  // 🔹 Logout

  @Post('logout')
  logout(@Req() req) {
    req.res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
    });

    req.res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }
  // 🔹 Forgot Password
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotpassword(email);
  }

  // 🔹 Reset Password
  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  // 🔥 Admin Only
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  adminOnly() {
    return {
      message: 'Only admin can access',
    };
  }

  // 🔥 Admin + Moderator
  @Get('moderator-area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  moderatorArea() {
    return {
      message: 'Admin or Moderator access',
    };
  }
}
// acess token ko validate { decode } user id logout ma bhjeni hy
