import { RepresentanteService } from './representante.service';

describe('RepresentanteService', () => {
  let service: RepresentanteService;
  let representanteRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    findAndCount: jest.Mock;
    remove: jest.Mock;
  };
  let nacionalidadRepository: { findOneBy: jest.Mock };
  let parentescoRepository: { findOneBy: jest.Mock };
  let cantonRepository: { findOneBy: jest.Mock };
  let repInfractorRepository: { count: jest.Mock };

  const buildPayload = () => ({
    nacionalidadId: 1,
    parentescoId: 2,
    cantonId: 3,
    nombre: 'Pedro',
    apellido: 'Gomez',
    cedula: '1714875214',
  });

  beforeEach(() => {
    representanteRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
    };
    nacionalidadRepository = { findOneBy: jest.fn() };
    parentescoRepository = { findOneBy: jest.fn() };
    cantonRepository = { findOneBy: jest.fn() };
    repInfractorRepository = { count: jest.fn() };

    service = new RepresentanteService(
      representanteRepository as any,
      nacionalidadRepository as any,
      parentescoRepository as any,
      cantonRepository as any,
      repInfractorRepository as any,
    );

    repInfractorRepository.count.mockResolvedValue(0);
  });

  it('createRepresentante returns success when relations exist', async () => {
    const payload = buildPayload();

    nacionalidadRepository.findOneBy.mockResolvedValue({
      id: payload.nacionalidadId,
    });
    parentescoRepository.findOneBy.mockResolvedValue({
      id: payload.parentescoId,
    });
    cantonRepository.findOneBy.mockResolvedValue({ id: payload.cantonId });

    representanteRepository.create.mockReturnValue({ ...payload });
    representanteRepository.save.mockResolvedValue({ id: 1 });

    const result = await service.createRepresentante(payload as any);

    expect(result.success).toBe(true);
    expect(representanteRepository.save).toHaveBeenCalled();
  });

  it('createRepresentante returns failure when nacionalidad is missing', async () => {
    const payload = buildPayload();

    nacionalidadRepository.findOneBy.mockResolvedValue(null);
    parentescoRepository.findOneBy.mockResolvedValue({
      id: payload.parentescoId,
    });
    cantonRepository.findOneBy.mockResolvedValue({ id: payload.cantonId });

    const result = await service.createRepresentante(payload as any);

    expect(result.success).toBe(false);
    expect(representanteRepository.save).not.toHaveBeenCalled();
  });

  it('getRepresentantes returns a paginated result', async () => {
    representanteRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

    const result = await service.getRepresentantes('', '', 1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('updateRepresentante returns failure when record is missing', async () => {
    const payload = buildPayload();
    representanteRepository.findOneBy.mockResolvedValue(null);

    const result = await service.updateRepresentante(1, payload as any);

    expect(result.success).toBe(false);
  });

  it('updateRepresentante returns success when record exists', async () => {
    const payload = buildPayload();
    representanteRepository.findOneBy.mockResolvedValue({ id: 1 });

    nacionalidadRepository.findOneBy.mockResolvedValue({
      id: payload.nacionalidadId,
    });
    parentescoRepository.findOneBy.mockResolvedValue({
      id: payload.parentescoId,
    });
    cantonRepository.findOneBy.mockResolvedValue({ id: payload.cantonId });
    representanteRepository.save.mockResolvedValue({ id: 1 });

    const result = await service.updateRepresentante(1, payload as any);

    expect(result.success).toBe(true);
  });

  it('deleteRepresentante returns failure when record is missing', async () => {
    representanteRepository.findOneBy.mockResolvedValue(null);

    const result = await service.deleteRepresentante(1);

    expect(result.success).toBe(false);
  });

  it('deleteRepresentante returns success when record exists', async () => {
    const representante = { id: 1 };
    representanteRepository.findOneBy.mockResolvedValue(representante);
    representanteRepository.remove.mockResolvedValue(representante);

    const result = await service.deleteRepresentante(1);

    expect(result.success).toBe(true);
    expect(representanteRepository.remove).toHaveBeenCalledWith(representante);
  });

  it('deleteRepresentante returns failure when has related records', async () => {
    const representante = { id: 1 };
    representanteRepository.findOneBy.mockResolvedValue(representante);
    repInfractorRepository.count.mockResolvedValue(2);

    const result = await service.deleteRepresentante(1);

    expect(result.success).toBe(false);
    expect(representanteRepository.remove).not.toHaveBeenCalled();
  });
});
