import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService],
  imports: [
    AuthModule, 
    TypeOrmModule.forFeature([Attendance]),
  ]
})
export class AttendancesModule {}
