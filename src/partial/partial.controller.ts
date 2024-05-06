import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PartialService } from './partial.service';
import { CreatePartialDto } from './dto/create-partial.dto';
import { UpdatePartialDto } from './dto/update-partial.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('partial')
@Auth(ValidRoles.admin)
export class PartialController {
  constructor(private readonly partialService: PartialService) {}

  @Post()
  create(@Body() createPartialDto: CreatePartialDto[]) {
    return this.partialService.create(createPartialDto);
  }

  @Get()
  findAll() {
    return this.partialService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.partialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updatePartialDto: UpdatePartialDto) {
    return this.partialService.update(id, updatePartialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partialService.remove(id);
  }
}
