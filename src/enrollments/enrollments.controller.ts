import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('enrollments')
@Auth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post(':subjectId')
  create(
    @Param('subjectId', ParseUUIDPipe ) subjectId: string,
    @Body() createEnrollmentDtos: CreateEnrollmentDto[],
    @GetUser() user: User
  ) {
    return this.enrollmentsService.create(subjectId, createEnrollmentDtos, user.id);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    return this.enrollmentsService.findAll(paginationDto);
  }

  @Get('subject/:subjectId')
  findBySubject(
    @Param('subjectId', ParseUUIDPipe ) subjectId: string
  ) {
    return this.enrollmentsService.findBySubject(subjectId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.enrollmentsService.remove(id);
  }
}
