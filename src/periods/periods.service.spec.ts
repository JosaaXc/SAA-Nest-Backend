import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { PeriodsService } from './periods.service';
import { Period } from './entities/period.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let clock: sinon.SinonFakeTimers;
  let periodRepository;

  beforeEach(async () => {
    periodRepository = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn(),
      findOne: jest.fn(), // Agrega esta línea
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodsService,
        {
          provide: getRepositoryToken(Period),
          useValue: periodRepository,
        },
      ],
    }).compile();

    service = module.get<PeriodsService>(PeriodsService);
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should create a new period when handleCron is called', async () => {
    const mockPeriod = { name: 'Otoño 2022' };
    periodRepository.findOne.mockReturnValue(Promise.resolve(mockPeriod));
  
    await service.handleCron();
    expect(periodRepository.create).toHaveBeenCalled();
    expect(periodRepository.save).toHaveBeenCalled();
  
    // Busca el período que se supone que se creó
    const period = await periodRepository.findOne({ name: 'Otoño 2022' });
    expect(period).toBeDefined();
    expect(period).toEqual(mockPeriod);
  });
});