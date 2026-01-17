import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    // Ustawiamy ciasteczko
    response.cookie('access_token', access_token, {
      httpOnly: true, // JS nie ma dostępu
      secure: false, // Na localhost: false.
      sameSite: 'lax', // może być 'strict'
      maxAge: 1000 * 60 * 60 * 24, // 1 dzień (w milisekundach)
    });

    return { user }; // Zwracamy tylko usera, token jest już w ciasteczku
  }

  @Post('register')
  async signUp(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, user } = await this.authService.register(registerDto);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    // Czyścimy ciasteczko

    response.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return { message: 'Logged out success' };
  }
  @UseGuards(JwtAuthGuard) // Chroniony endpoint, wymaga ciasteczka
  @Get('profile')
  getProfile(@Req() req: { user: User }) {
    // req.user jest ustawiany przez JwtStrategy po pomyślnej weryfikacji tokena
    return req.user;
  }
}
