import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  
  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createStudentDto: CreateStudentDto
  ) {
    return this.studentsService.create(createStudentDto);
  }
  
  @Get()
  @Auth()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.studentsService.findAll( paginationDto );
  }

  @Get('count-students')
  @Auth()
  async countStudents() {
    const totalStudents = await this.studentsService.countStudents();
    return { totalStudents };
  }

  @Get(':id')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.studentsService.findOne(id);
  }
  
  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }
  
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.studentsService.remove(id);
  }
}
