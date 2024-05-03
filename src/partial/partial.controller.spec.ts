import { Test, TestingModule } from '@nestjs/testing';
import { PartialController } from './partial.controller';
import { PartialService } from './partial.service';

describe('PartialController', () => {
  let controller: PartialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartialController],
      providers: [PartialService],
    }).compile();

    controller = module.get<PartialController>(PartialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
