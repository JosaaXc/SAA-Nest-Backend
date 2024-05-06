import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [ 
    AuthModule, 
    TypeOrmModule.forFeature([
      Subject
  ]),
],
  exports : [TypeOrmModule, SubjectsService]
})
export class SubjectsModule {}
