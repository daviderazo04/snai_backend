import { AdolescenteService } from './adolescente.service';

describe('AdolescenteService', () => {
  let service: AdolescenteService;
  let adolescenteRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    findAndCount: jest.Mock;
  };
  let caiRepository: { findOneBy: jest.Mock };
  let nacionalidadRepository: { findOneBy: jest.Mock };
  let estadoCivilRepository: { findOneBy: jest.Mock };
  let gdosRepository: { findOneBy: jest.Mock };
  let etniaRepository: { findOneBy: jest.Mock };
  let cantonRepository: { findOneBy: jest.Mock };
  let repInfractorRepository: { count: jest.Mock };
  let juridicoRepository: { count: jest.Mock };
  let ocupacionRepository: { count: jest.Mock };
  let familiaRepository: { count: jest.Mock };
  let saludRepository: { count: jest.Mock };
  let educaRepository: { count: jest.Mock };
  let trasladoRepository: { count: jest.Mock };

  const buildPayload = () => ({
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
  });

  beforeEach(() => {
    adolescenteRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
    };
    caiRepository = { findOneBy: jest.fn() };
    nacionalidadRepository = { findOneBy: jest.fn() };
    estadoCivilRepository = { findOneBy: jest.fn() };
    gdosRepository = { findOneBy: jest.fn() };
    etniaRepository = { findOneBy: jest.fn() };
    cantonRepository = { findOneBy: jest.fn() };
    repInfractorRepository = { count: jest.fn() };
    juridicoRepository = { count: jest.fn() };
    ocupacionRepository = { count: jest.fn() };
    familiaRepository = { count: jest.fn() };
    saludRepository = { count: jest.fn() };
    educaRepository = { count: jest.fn() };
    trasladoRepository = { count: jest.fn() };

    service = new AdolescenteService(
      adolescenteRepository as any,
      caiRepository as any,
      nacionalidadRepository as any,
      estadoCivilRepository as any,
      gdosRepository as any,
      etniaRepository as any,
      cantonRepository as any,
      repInfractorRepository as any,
      juridicoRepository as any,
      ocupacionRepository as any,
      familiaRepository as any,
      saludRepository as any,
      educaRepository as any,
      trasladoRepository as any,
    );

    repInfractorRepository.count.mockResolvedValue(0);
    juridicoRepository.count.mockResolvedValue(0);
    ocupacionRepository.count.mockResolvedValue(0);
    familiaRepository.count.mockResolvedValue(0);
    saludRepository.count.mockResolvedValue(0);
    educaRepository.count.mockResolvedValue(0);
    trasladoRepository.count.mockResolvedValue(0);
  });

  it('createAdolescente returns success when relations exist', async () => {
    const payload = buildPayload();

    caiRepository.findOneBy.mockResolvedValue({ id: payload.caiId });
    nacionalidadRepository.findOneBy.mockResolvedValue({
      id: payload.nacionalidadId,
    });
    estadoCivilRepository.findOneBy.mockResolvedValue({
      id: payload.estadoCivilId,
    });
    gdosRepository.findOneBy.mockResolvedValue({ id: payload.gdosId });
    etniaRepository.findOneBy.mockResolvedValue({ id: payload.etniaId });
    cantonRepository.findOneBy.mockResolvedValue({ id: payload.cantonId });

    adolescenteRepository.create.mockReturnValue({ ...payload });
    adolescenteRepository.save.mockResolvedValue({ id: 1 });

    const result = await service.createAdolescente(payload as any);

    expect(result.success).toBe(true);
    expect(adolescenteRepository.save).toHaveBeenCalled();
  });

  it('createAdolescente returns failure when cai is missing', async () => {
    const payload = buildPayload();

    caiRepository.findOneBy.mockResolvedValue(null);
    nacionalidadRepository.findOneBy.mockResolvedValue({
      id: payload.nacionalidadId,
    });
    estadoCivilRepository.findOneBy.mockResolvedValue({
      id: payload.estadoCivilId,
    });
    gdosRepository.findOneBy.mockResolvedValue({ id: payload.gdosId });
    etniaRepository.findOneBy.mockResolvedValue({ id: payload.etniaId });
    cantonRepository.findOneBy.mockResolvedValue({ id: payload.cantonId });

    const result = await service.createAdolescente(payload as any);

    expect(result.success).toBe(false);
    expect(adolescenteRepository.save).not.toHaveBeenCalled();
  });

  it('getAdolescentes returns a paginated result', async () => {
    adolescenteRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

    const result = await service.getAdolescentes('', '', 1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('updateAdolescente returns failure when record is missing', async () => {
    const payload = buildPayload();
    adolescenteRepository.findOneBy.mockResolvedValue(null);

    const result = await service.updateAdolescente(1, payload as any);

    expect(result.success).toBe(false);
  });

  it('updateAdolescente returns success when record exists', async () => {
    const payload = buildPayload();
    adolescenteRepository.findOneBy.mockResolvedValue({ id: 1 });

    caiRepository.findOneBy.mockResolvedValue({ id: payload.caiId });
    nacionalidadRepository.findOneBy.mockResolvedValue({
      id: payload.nacionalidadId,
    });
    estadoCivilRepository.findOneBy.mockResolvedValue({
      id: payload.estadoCivilId,
    });
    gdosRepository.findOneBy.mockResolvedValue({ id: payload.gdosId });
    etniaRepository.findOneBy.mockResolvedValue({ id: payload.etniaId });
    cantonRepository.findOneBy.mockResolvedValue({ id: payload.cantonId });

    adolescenteRepository.save.mockResolvedValue({ id: 1 });

    const result = await service.updateAdolescente(1, payload as any);

    expect(result.success).toBe(true);
  });

  it('softDeleteAdolescente returns failure when record is missing', async () => {
    adolescenteRepository.findOneBy.mockResolvedValue(null);

    const result = await service.softDeleteAdolescente(1);

    expect(result.success).toBe(false);
  });

  it('softDeleteAdolescente returns success when record exists', async () => {
    const adolescente = { id: 1 };
    adolescenteRepository.findOneBy.mockResolvedValue(adolescente);
    adolescenteRepository.save.mockResolvedValue(adolescente);

    const result = await service.softDeleteAdolescente(1);

    expect(result.success).toBe(true);
    expect(adolescenteRepository.save).toHaveBeenCalledWith(adolescente);
  });

  it('softDeleteAdolescente returns failure when has related records', async () => {
    const adolescente = { id: 1 };
    adolescenteRepository.findOneBy.mockResolvedValue(adolescente);
    repInfractorRepository.count.mockResolvedValue(1);

    const result = await service.softDeleteAdolescente(1);

    expect(result.success).toBe(false);
    expect(adolescenteRepository.save).not.toHaveBeenCalled();
  });
});
