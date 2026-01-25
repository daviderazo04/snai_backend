import { RepInfractorService } from './repInfractor.service';

describe('RepInfractorService', () => {
  let service: RepInfractorService;
  let repInfractorRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    findAndCount: jest.Mock;
    remove: jest.Mock;
  };
  let adolescenteRepository: {
    findOne: jest.Mock;
    findOneBy: jest.Mock;
  };
  let representanteRepository: {
    findOne: jest.Mock;
    findOneBy: jest.Mock;
  };

  const buildPayload = () => ({
    adolescenteId: 1,
    representanteId: 2,
    fechaInicio: '2008-05-20',
    fechaFin: '2018-05-20',
  });

  beforeEach(() => {
    repInfractorRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
    };
    adolescenteRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };
    representanteRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    service = new RepInfractorService(
      repInfractorRepository as any,
      adolescenteRepository as any,
      representanteRepository as any,
    );
  });

  it('createRepInfractor returns success when relations exist', async () => {
    const payload = buildPayload();

    adolescenteRepository.findOne.mockResolvedValue({ id: payload.adolescenteId });
    representanteRepository.findOne.mockResolvedValue({
      id: payload.representanteId,
    });
    repInfractorRepository.create.mockReturnValue({ ...payload });
    repInfractorRepository.save.mockResolvedValue({ id: 1 });

    const result = await service.createRepInfractor(payload as any);

    expect(result.success).toBe(true);
    expect(repInfractorRepository.save).toHaveBeenCalled();
  });

  it('createRepInfractor returns failure when adolescente is missing', async () => {
    const payload = buildPayload();

    adolescenteRepository.findOne.mockResolvedValue(null);
    representanteRepository.findOne.mockResolvedValue({
      id: payload.representanteId,
    });

    const result = await service.createRepInfractor(payload as any);

    expect(result.success).toBe(false);
    expect(repInfractorRepository.save).not.toHaveBeenCalled();
  });

  it('getRepInfractores returns a paginated result', async () => {
    repInfractorRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

    const result = await service.getRepInfractores(undefined, undefined, 1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('updateRepInfractor returns failure when record is missing', async () => {
    const payload = buildPayload();
    repInfractorRepository.findOneBy.mockResolvedValue(null);

    const result = await service.updateRepInfractor(1, payload as any);

    expect(result.success).toBe(false);
  });

  it('updateRepInfractor returns success when record exists', async () => {
    const payload = buildPayload();
    repInfractorRepository.findOneBy.mockResolvedValue({ id: 1 });
    adolescenteRepository.findOneBy.mockResolvedValue({
      id: payload.adolescenteId,
    });
    representanteRepository.findOneBy.mockResolvedValue({
      id: payload.representanteId,
    });
    repInfractorRepository.save.mockResolvedValue({ id: 1 });

    const result = await service.updateRepInfractor(1, payload as any);

    expect(result.success).toBe(true);
  });

  it('deleteRepInfractor returns failure when record is missing', async () => {
    repInfractorRepository.findOneBy.mockResolvedValue(null);

    const result = await service.deleteRepInfractor(1);

    expect(result.success).toBe(false);
  });

  it('deleteRepInfractor returns success when record exists', async () => {
    const repInfractor = { id: 1 };
    repInfractorRepository.findOneBy.mockResolvedValue(repInfractor);
    repInfractorRepository.remove.mockResolvedValue(repInfractor);

    const result = await service.deleteRepInfractor(1);

    expect(result.success).toBe(true);
    expect(repInfractorRepository.remove).toHaveBeenCalledWith(repInfractor);
  });
});
