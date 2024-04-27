import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService],
  imports: [
    AuthModule, 
    EnrollmentsModule, 
    TypeOrmModule.forFeature([Attendance]),
  ]
})
export class AttendancesModule {}
