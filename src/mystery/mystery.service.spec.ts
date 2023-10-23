import { Test, TestingModule } from '@nestjs/testing';
import { MysteryService } from './mystery.service';

describe('MysteryService', () => {
  let service: MysteryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MysteryService],
    }).compile();

    service = module.get<MysteryService>(MysteryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
