import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { HttpModule } from '@nestjs/axios';

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AddressesService],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
