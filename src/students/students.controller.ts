import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  
  @Auth(ValidRoles.admin)
  @Post()
  create(
    @Body() createStudentDto: CreateStudentDto
  ) {
    return this.studentsService.create(createStudentDto);
  }
  
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.studentsService.findAll( paginationDto );
  }
  
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.studentsService.findOne(id);
  }
  
  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }
  
  @Auth(ValidRoles.admin)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.studentsService.remove(id);
  }
}
