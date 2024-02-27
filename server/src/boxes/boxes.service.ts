import { Injectable } from '@nestjs/common';
import { Box } from './interfaces/box.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoxesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Box[]> {
    const HAYTEK_API_URL = this.configService.get<string>('HAYTEK_API_URL');
    const { data } = await firstValueFrom(
      this.httpService.get<Box[]>(`${HAYTEK_API_URL}/boxes`),
    );
    return data;
  }
}
