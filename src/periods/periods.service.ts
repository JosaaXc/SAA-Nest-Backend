import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreatePeriodDto } from './dto/create-period.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
  ) {}

  @Cron(CronExpression.EVERY_6_MONTHS)
  async handleCron() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const periodName = month < 6 ? `Primavera ${year}` : `Otoño ${year}`;

    const newPeriod = this.periodRepository.create({ name: periodName });
    await this.periodRepository.save(newPeriod);
  }

  async create(createPeriodDto: CreatePeriodDto) {
    try {
      
    const newPeriod = this.periodRepository.create(createPeriodDto);
    return await this.periodRepository.save(newPeriod);

    } catch (error) {
      handleDBError(error);
    }
  }

  async findAll() {
    try {
      return await this.periodRepository.find();
    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updatePeriodDto: CreatePeriodDto) {
    try {
      await this.periodRepository.update(id, updatePeriodDto);
      return await this.periodRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.periodRepository.delete(id);
      return { message: 'Period eliminated' }
    } catch (error) {
      handleDBError(error);
    }
  }

}