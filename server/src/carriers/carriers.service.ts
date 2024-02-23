import { Injectable } from '@nestjs/common';
import { Carrier } from './interfaces/carrier.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CarriersService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Carrier[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Carrier[]>(
        'https://stg-api.haytek.com.br/api/v1/test-haytek-api/carriers',
      ),
    );
    return data;
  }
}
