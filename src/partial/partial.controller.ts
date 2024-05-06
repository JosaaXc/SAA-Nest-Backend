import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PartialService } from './partial.service';
import { CreatePartialDto } from './dto/create-partial.dto';
import { UpdatePartialDto } from './dto/update-partial.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('partial')
export class PartialController {
  constructor(private readonly partialService: PartialService) {}
  
  @Post(':partialId')
  @Auth(ValidRoles.admin)
  create(
    @Param('partialId', ParseUUIDPipe) partialId: string,
    @Body() createPartialDto: CreatePartialDto[]
  ) {
    return this.partialService.create(partialId, createPartialDto);
  }
  
  @Get()
  @Auth()
  findAll() {
    return this.partialService.findAll();
  }
  
  @Get(':id')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.partialService.findOne(id);
  }
  
  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updatePartialDto: UpdatePartialDto) {
      return this.partialService.update(id, updatePartialDto);
    }
    
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.partialService.remove(id);
  }
}
