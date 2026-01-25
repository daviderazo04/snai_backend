import { Test, TestingModule } from '@nestjs/testing';
import { RepInfractoresController } from './repInfractor.controller';
import { RepInfractorService } from '../services/repInfractor.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';

describe('RepInfractoresController', () => {
  let controller: RepInfractoresController;
  let service: {
    createRepInfractor: jest.Mock;
    getRepInfractores: jest.Mock;
    updateRepInfractor: jest.Mock;
    deleteRepInfractor: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      createRepInfractor: jest.fn(),
      getRepInfractores: jest.fn(),
      updateRepInfractor: jest.fn(),
      deleteRepInfractor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepInfractoresController],
      providers: [
        {
          provide: RepInfractorService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(PermisosGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get(RepInfractoresController);
  });

  it('createRepInfractor delegates to service', async () => {
    const payload = {
      adolescenteId: 1,
      representanteId: 2,
      fechaInicio: '2008-05-20',
      fechaFin: '2018-05-20',
    };
    const expected = { success: true };
    service.createRepInfractor.mockResolvedValue(expected);

    await expect(controller.createRepInfractor(payload as any)).resolves.toBe(
      expected,
    );
    expect(service.createRepInfractor).toHaveBeenCalledWith(payload);
  });

  it('getRepInfractores delegates to service', async () => {
    const expected = { data: [] };
    service.getRepInfractores.mockResolvedValue(expected);

    await expect(
      controller.getRepInfractores(1, 2, 1, 10),
    ).resolves.toBe(expected);
    expect(service.getRepInfractores).toHaveBeenCalledWith(1, 2, 1, 10);
  });

  it('updateRepInfractor delegates to service', async () => {
    const payload = {
      adolescenteId: 1,
      representanteId: 2,
      fechaInicio: '2008-05-20',
      fechaFin: '2018-05-20',
    };
    const expected = { success: true };
    service.updateRepInfractor.mockResolvedValue(expected);

    await expect(
      controller.updateRepInfractor(1, payload as any),
    ).resolves.toBe(expected);
    expect(service.updateRepInfractor).toHaveBeenCalledWith(1, payload);
  });

  it('deleteRepInfractor delegates to service', async () => {
    const expected = { success: true };
    service.deleteRepInfractor.mockResolvedValue(expected);

    await expect(controller.deleteRepInfractor(1)).resolves.toBe(expected);
    expect(service.deleteRepInfractor).toHaveBeenCalledWith(1);
  });
});
