import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }

}
