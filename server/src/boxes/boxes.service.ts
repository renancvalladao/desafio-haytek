import { Injectable } from '@nestjs/common';
import { Box } from './interfaces/box.interface';

@Injectable()
export class BoxesService {
  findAll(): Box[] {
    return [];
  }
}
