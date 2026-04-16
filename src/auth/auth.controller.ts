import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }
    @Post('login')
    login(
        @Body()
        dto: LoginDto
    ) {
        return this.authService.login(dto)
    }
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: any) {
        return {
            id: user.sub,
            email: user.email,
            role: user.role,
        };
    }


    @Post('refresh')
refresh(@Body('refreshToken') token: string) {
  return this.authService.refresh(token);
}
@Post('logout')
@UseGuards(JwtAuthGuard)
logout(@CurrentUser() user:any){
    return this.authService.logout(user.sub)
}

@Post('forgot-password')
forgot(@Body('email') email:string){
    return this.authService.forgotpassword(email)
}
@Post('reset-password')
reset(
  @Body('token') token: string,
  @Body('password') password: string,
) {
  return this.authService.resetPassword(token, password);
}
}
