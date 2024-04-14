import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [
    AuthModule, 
    TypeOrmModule.forFeature([
      Student
    ])
  ],
  exports: [TypeOrmModule, StudentsService]
})
export class StudentsModule {}
