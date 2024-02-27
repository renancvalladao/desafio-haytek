import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
