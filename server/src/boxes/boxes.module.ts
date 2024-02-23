import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';

@Module({
  providers: [BoxesService],
})
export class BoxesModule {}
