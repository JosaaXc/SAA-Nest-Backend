import { Module } from '@nestjs/common';
import { PartialService } from './partial.service';
import { PartialController } from './partial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partial } from './entities/partial.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PartialController],
  providers: [PartialService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Partial      
    ])
  ]
})
export class PartialModule {}
