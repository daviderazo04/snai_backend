import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoginPayloadDto } from './dto/login.payload.dto';
import { RegisterPayloadDto } from './dto/register.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { LoginResponseData } from './dto/login.response.data';
import * as JWTUser from '../common/jwt/JWTUser';
import { Public } from '../common/decorators/public.decorator';
import { PermisosGuard } from '../common/guards/permisos.guard';

@ApiTags('Auth')
@ApiExtraModels(ResultWithData, LoginResponseData, JWTUser.JwtUser)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticar a un usuario con sus credenciales' })
  @ApiBody({ type: LoginPayloadDto })
  @ApiOkResponse({
    description: 'Autenticación exitosa',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(LoginResponseData) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  @ApiBadRequestResponse({
    description: 'El payload enviado no cumple las validaciones necesarias',
  })
  async login(
    @Body() loginDto: LoginPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    return this.authService.login(loginDto);
  }
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario en la plataforma' })
  @ApiBody({ type: RegisterPayloadDto })
  @ApiCreatedResponse({
    description: 'Usuario registrado y autenticado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(LoginResponseData) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'La información proporcionada no es válida o el correo ya existe',
  })
  async register(
    @Body() registerDto: RegisterPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener la información del usuario autenticado' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Perfil obtenido correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(JWTUser.JwtUser) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No se proporcionó un token válido o expiró',
  })
  getProfile(
    @Request() req: JWTUser.AuthenticatedRequest,
  ): ResultWithData<JWTUser.JwtUser> {
    return new ResultWithData(true, 'Éxito', req.user);
  }
}
