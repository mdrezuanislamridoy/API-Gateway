import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() credentials: RegisterDto) {
    return this.authService.register(credentials.email, credentials.password);
  }

  @Post('login')
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials.email, credentials.password);
  }
}
