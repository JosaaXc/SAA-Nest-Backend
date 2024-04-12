import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Auth()
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @GetUser() user: User
  ) {
    return this.subjectsService.create(createSubjectDto, user);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get('own-subjects')
  @Auth()
  findMany(
    @GetUser() user: User
  ) {
    return this.subjectsService.findManyByUser(user.id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateSubjectDto: UpdateSubjectDto,
    @GetUser() user: User
  ) {
    return this.subjectsService.update(id, user, updateSubjectDto);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id') id: string
  ) {
    return this.subjectsService.remove(id);
  }
}
