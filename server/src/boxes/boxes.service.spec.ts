import { Test, TestingModule } from '@nestjs/testing';
import { BoxesService } from './boxes.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('BoxesService', () => {
  let service: BoxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [BoxesService],
    }).compile();

    service = module.get<BoxesService>(BoxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
