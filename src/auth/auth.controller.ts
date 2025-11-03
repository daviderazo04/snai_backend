import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginPayloadDto } from './dto/login.payload.dto';
import { RegisterPayloadDto } from './dto/register.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { LoginResponseData } from './dto/login.response.data';
import { Usuario } from '../usuario/entities/usuario.entity';
import * as JWTUser from './internalClasses/JWTUser';
import { JwtUser } from './internalClasses/JWTUser';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: JWTUser.AuthenticatedRequest,
  ): ResultWithData<JwtUser> {
    console.log(req.user.roles);
    return new ResultWithData(true, 'Éxito', req.user);
  }
}
