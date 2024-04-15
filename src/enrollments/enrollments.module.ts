import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Subject } from 'rxjs';
import { Student } from 'src/students/entities/student.entity';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  imports: [
    AuthModule, 
    TypeOrmModule.forFeature([
      Enrollment
    ])
  ],
  exports: [TypeOrmModule, EnrollmentsService]
})
export class EnrollmentsModule {}
