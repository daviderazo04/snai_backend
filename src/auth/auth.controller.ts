import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
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
import { PerfilDto } from './dto/perfil.dto';
import { Public } from '../common/decorators/public.decorator';
import { PermisosGuard } from '../common/guards/permisos.guard';

@ApiTags('Auth')
@ApiExtraModels(ResultWithData, LoginResponseData, JWTUser.JwtUser, PerfilDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar a un usuario con su cedula y contraseña',
  })
  @ApiBody({ type: LoginPayloadDto })
  @ApiOkResponse({
    description:
      'Autenticación exitosa; devuelve token, usuario y perfiles disponibles',
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
    description:
      'Usuario registrado y autenticado correctamente; devuelve token, usuario y perfiles disponibles',
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
      'La información proporcionada no es válida o la cédula/correo ya existe',
  })
  async register(
    @Body() registerDto: RegisterPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('gain-access')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener un JWT firmado para un perfil específico',
    description:
      'Recibe el ID de un perfil asignado al usuario, valida que tenga acceso y devuelve un JWT firmado con ese perfil activo y sus permisos',
  })
  @ApiBearerAuth()
  @ApiBody({ type: PerfilDto })
  @ApiOkResponse({
    description:
      'Acceso concedido; devuelve JWT firmado con el perfil activo, usuario y lista de perfiles',
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
  @ApiUnauthorizedResponse({
    description:
      'Token inválido/expirado o el perfil no pertenece al usuario autenticado',
  })
  async gainAccess(
    @Request() req: JWTUser.AuthenticatedRequest,
    @Body() perfil: PerfilDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    return this.authService.gainAccess(req.user, perfil);
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
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
