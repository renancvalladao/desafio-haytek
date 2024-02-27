import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [AddressesService],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFullAddress', () => {
    it('should return the full address', () => {
      const address = {
        Id: '2ceb4f33-368a-45ab-85bd-2f67c0951067',
        state: 'RJ',
        zipcode: '21050700',
        street: 'Rua Astrei',
        complement: 'Apartamento 501',
        neighborhood: 'Higienópolis',
        city: 'Rio de Janeiro',
      };
      const expectedFullAddress =
        'Rua Astrei, Apartamento 501, Higienópolis, 21050700, Rio de Janeiro/RJ';
      const fullAddress = service.getFullAddress(address);
      expect(fullAddress).toBe(expectedFullAddress);
    });

    it('should return the full address without the complement', () => {
      const address = {
        Id: '2ceb4f33-368a-45ab-85bd-2f67c0951067',
        state: 'RJ',
        zipcode: '21050700',
        street: 'Rua Astrei',
        complement: '',
        neighborhood: 'Higienópolis',
        city: 'Rio de Janeiro',
      };
      const expectedFullAddress =
        'Rua Astrei, Higienópolis, 21050700, Rio de Janeiro/RJ';
      const fullAddress = service.getFullAddress(address);
      expect(fullAddress).toBe(expectedFullAddress);
    });
  });
});
