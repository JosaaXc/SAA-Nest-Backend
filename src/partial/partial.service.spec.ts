import { Test, TestingModule } from '@nestjs/testing';
import { PartialService } from './partial.service';

describe('PartialService', () => {
  let service: PartialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartialService],
    }).compile();

    service = module.get<PartialService>(PartialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
