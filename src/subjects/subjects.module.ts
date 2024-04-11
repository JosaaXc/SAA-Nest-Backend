import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

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
