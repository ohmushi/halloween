import { Test, TestingModule } from '@nestjs/testing';
import { MysteryController } from './mystery.controller';
import { MysteryService } from '../mystery.service';

describe('MysteryController', () => {
  let controller: MysteryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MysteryController],
      providers: [MysteryService],
    }).compile();

    controller = module.get<MysteryController>(MysteryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
