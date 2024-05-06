import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PeriodsController],
  providers: [PeriodsService],
  imports: [
    AuthModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Period
    ])
  ]
})
export class PeriodsModule {}
