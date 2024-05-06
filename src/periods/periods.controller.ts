import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}
  
  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }
  
  @Get()
  @Auth()
  findAll() {
    return this.periodsService.findAll();
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updatePeriodDto: CreatePeriodDto
  ) {
    return this.periodsService.update(id, updatePeriodDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.periodsService.remove(id);
  }

}
