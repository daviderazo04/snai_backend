import { Test, TestingModule } from '@nestjs/testing';
import { AdolescentesController } from './adolescente.controller';
import { AdolescenteService } from '../services/adolescente.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';

describe('AdolescentesController', () => {
  let controller: AdolescentesController;
  let service: {
    createAdolescente: jest.Mock;
    getAdolescentes: jest.Mock;
    updateAdolescente: jest.Mock;
    softDeleteAdolescente: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      createAdolescente: jest.fn(),
      getAdolescentes: jest.fn(),
      updateAdolescente: jest.fn(),
      softDeleteAdolescente: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdolescentesController],
      providers: [
        {
          provide: AdolescenteService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(PermisosGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get(AdolescentesController);
  });

  it('createAdolescente delegates to service', async () => {
    const payload = {
      caiId: 1,
      nacionalidadId: 2,
      estadoCivilId: 3,
      gdosId: 4,
      etniaId: 5,
      cantonId: 6,
      nombre: 'Juan',
      apellido: 'Perez',
      fecha_nac: '2008-05-20',
      hijos: 0,
      fecha_ingr: '2018-07-10',
      cedula: '1714875214',
      hijoPpl: '0',
      reincide: '0',
      observaciones: 'Observacion',
    };
    const expected = { success: true };
    service.createAdolescente.mockResolvedValue(expected);

    await expect(controller.createAdolescente(payload as any)).resolves.toBe(
      expected,
    );
    expect(service.createAdolescente).toHaveBeenCalledWith(payload);
  });

  it('getAdolescentes delegates to service', async () => {
    const expected = { data: [] };
    service.getAdolescentes.mockResolvedValue(expected);

    await expect(controller.getAdolescentes('a', '1', 1, 10)).resolves.toBe(
      expected,
    );
    expect(service.getAdolescentes).toHaveBeenCalledWith('a', '1', 1, 10);
  });

  it('updateAdolescente delegates to service', async () => {
    const payload = {
      caiId: 1,
      nacionalidadId: 2,
      estadoCivilId: 3,
      gdosId: 4,
      etniaId: 5,
      cantonId: 6,
      nombre: 'Juan',
      apellido: 'Perez',
      fecha_nac: '2008-05-20',
      hijos: 0,
      fecha_ingr: '2018-07-10',
      cedula: '1714875214',
      hijoPpl: '0',
      reincide: '0',
      observaciones: 'Observacion',
    };
    const expected = { success: true };
    service.updateAdolescente.mockResolvedValue(expected);

    await expect(controller.updateAdolescente(1, payload as any)).resolves.toBe(
      expected,
    );
    expect(service.updateAdolescente).toHaveBeenCalledWith(1, payload);
  });

  it('deleteAdolescente delegates to service', async () => {
    const expected = { success: true };
    service.softDeleteAdolescente.mockResolvedValue(expected);

    await expect(controller.deleteAdolescente(1)).resolves.toBe(expected);
    expect(service.softDeleteAdolescente).toHaveBeenCalledWith(1);
  });
});
