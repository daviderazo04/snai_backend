import { Test, TestingModule } from '@nestjs/testing';
import { RepresentantesController } from './representante.controller';
import { RepresentanteService } from '../services/representante.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';

describe('RepresentantesController', () => {
  let controller: RepresentantesController;
  let service: {
    createRepresentante: jest.Mock;
    getRepresentantes: jest.Mock;
    updateRepresentante: jest.Mock;
    deleteRepresentante: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      createRepresentante: jest.fn(),
      getRepresentantes: jest.fn(),
      updateRepresentante: jest.fn(),
      deleteRepresentante: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepresentantesController],
      providers: [
        {
          provide: RepresentanteService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(PermisosGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get(RepresentantesController);
  });

  it('createRepresentante delegates to service', async () => {
    const payload = {
      nacionalidadId: 1,
      parentescoId: 2,
      cantonId: 3,
      nombre: 'Pedro',
      apellido: 'Gomez',
      cedula: '1714875214',
    };
    const expected = { success: true };
    service.createRepresentante.mockResolvedValue(expected);

    await expect(controller.createRepresentante(payload as any)).resolves.toBe(
      expected,
    );
    expect(service.createRepresentante).toHaveBeenCalledWith(payload);
  });

  it('getRepresentantes delegates to service', async () => {
    const expected = { data: [] };
    service.getRepresentantes.mockResolvedValue(expected);

    await expect(controller.getRepresentantes('a', '1', 1, 10)).resolves.toBe(
      expected,
    );
    expect(service.getRepresentantes).toHaveBeenCalledWith('a', '1', 1, 10);
  });

  it('updateRepresentante delegates to service', async () => {
    const payload = {
      nacionalidadId: 1,
      parentescoId: 2,
      cantonId: 3,
      nombre: 'Pedro',
      apellido: 'Gomez',
      cedula: '1714875214',
    };
    const expected = { success: true };
    service.updateRepresentante.mockResolvedValue(expected);

    await expect(
      controller.updateRepresentante(1, payload as any),
    ).resolves.toBe(expected);
    expect(service.updateRepresentante).toHaveBeenCalledWith(1, payload);
  });

  it('deleteRepresentante delegates to service', async () => {
    const expected = { success: true };
    service.deleteRepresentante.mockResolvedValue(expected);

    await expect(controller.deleteRepresentante(1)).resolves.toBe(expected);
    expect(service.deleteRepresentante).toHaveBeenCalledWith(1);
  });
});
