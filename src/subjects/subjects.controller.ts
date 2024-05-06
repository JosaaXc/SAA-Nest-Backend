import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('subjects')
@Auth()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @GetUser() user: User
  ) {
    return this.subjectsService.create(createSubjectDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.subjectsService.findAll( paginationDto );
  }

  @Get('own-subjects')
  findMany(
    @GetUser() user: User
  ) {
    return this.subjectsService.findManyByUser(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateSubjectDto: UpdateSubjectDto,
    @GetUser() user: User
  ) {
    return this.subjectsService.update(id, user, updateSubjectDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.subjectsService.remove(id);
  }
}
