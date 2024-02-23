import { Injectable } from '@nestjs/common';
import { Address } from './interfaces/address.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressesService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Address[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Address[]>(
        'https://stg-api.haytek.com.br/api/v1/test-haytek-api/adresses',
      ),
    );
    return data;
  }

  getFullAddress(address: Address): string {
    return `${address.street}, ${address.complement ? address.complement + ', ' : ''}${address.neighborhood}, ${address.zipcode}, ${address.city}/${address.state}`;
  }
}
