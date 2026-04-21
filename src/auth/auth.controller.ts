import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/role.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

// 🔹 Type for current user
interface JwtUser {
  sub: number;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 Register
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 🔹 Login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
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
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }

  // 🔹 Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: JwtUser) {
    return this.authService.logout(user.sub);
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