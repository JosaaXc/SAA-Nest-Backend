import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}
  
  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }
  
  @Auth(ValidRoles.admin)
  @Get()
  findAll() {
    return this.periodsService.findAll();
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updatePeriodDto: CreatePeriodDto
  ) {
    return this.periodsService.update(id, updatePeriodDto);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.periodsService.remove(id);
  }

}
