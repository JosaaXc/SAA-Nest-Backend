import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  imports: [
    AuthModule, 
    TypeOrmModule.forFeature([
      Enrollment,
      Student
    ])
  ],
  exports: [TypeOrmModule, EnrollmentsService]
})
export class EnrollmentsModule {}
