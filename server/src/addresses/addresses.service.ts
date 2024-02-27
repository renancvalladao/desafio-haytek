import { Injectable } from '@nestjs/common';
import { Address } from './interfaces/address.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AddressesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Address[]> {
    const HAYTEK_API_URL = this.configService.get<string>('HAYTEK_API_URL');
    const { data } = await firstValueFrom(
      this.httpService.get<Address[]>(`${HAYTEK_API_URL}/adresses`),
    );
    return data;
  }

  getFullAddress(address: Address): string {
    return `${address.street}, ${address.complement ? address.complement + ', ' : ''}${address.neighborhood}, ${address.zipcode}, ${address.city}/${address.state}`;
  }
}
