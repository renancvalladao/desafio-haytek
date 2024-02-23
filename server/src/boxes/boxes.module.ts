import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
