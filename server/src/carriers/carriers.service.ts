import { Injectable } from '@nestjs/common';
import { Carrier } from './interfaces/carrier.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CarriersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Carrier[]> {
    const HAYTEK_API_URL = this.configService.get<string>('HAYTEK_API_URL');
    const { data } = await firstValueFrom(
      this.httpService.get<Carrier[]>(`${HAYTEK_API_URL}/carriers`),
    );
    return data;
  }
}
