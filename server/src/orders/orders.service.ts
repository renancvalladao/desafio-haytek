import { Injectable } from '@nestjs/common';
import { Order } from './interfaces/order.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Order[]> {
    const HAYTEK_API_URL = this.configService.get<string>('HAYTEK_API_URL');
    const { data } = await firstValueFrom(
      this.httpService.get<Order[]>(`${HAYTEK_API_URL}/orders`),
    );
    return data;
  }
}
