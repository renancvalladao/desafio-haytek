import { Test, TestingModule } from '@nestjs/testing';
import { CarriersService } from './carriers.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('CarriersService', () => {
  let service: CarriersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [CarriersService],
    }).compile();

    service = module.get<CarriersService>(CarriersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
