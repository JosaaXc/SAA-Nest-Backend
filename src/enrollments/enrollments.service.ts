import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EnrollmentsService {

  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}
  
  async create(createEnrollmentDtos: CreateEnrollmentDto[], userId: string) {
    try {
      const enrollments = createEnrollmentDtos.map(dto => this.enrollmentRepository.create({
        ...dto,
        addedBy: userId
      }));
  
      await this.enrollmentRepository.save(enrollments);
      return enrollments;
  
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10 , offset = 0 } = paginationDto;
  
    const enrollments = await this.enrollmentRepository.find({
      take: limit,
      skip: offset,
    });
  
    return enrollments.map(({ studentId, subjectId, addedBy, ...enrollment }) => enrollment);
  }

  async findOne(id: string) {

    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['student', 'subject', 'addedByUser']
    });

    if (!enrollment) 
      throw new NotFoundException('Resource not found');

    const { studentId, subjectId, addedBy, ...enrollmentData } = enrollment;
    return enrollmentData;


  }

  async remove(id: string) {
    const result = await this.enrollmentRepository.delete({ id });
      if (result.affected === 0) 
        throw new NotFoundException('Resource not found');
    
    return { mesagge: 'Enrollment deleted successfully' };
  }
  
  private handleDBError(error: any): never {
    if( error.code === '23505') 
      throw new BadRequestException( error.detail )

    if( error.code === '0A000') 
      throw new NotFoundException('Resource not found')

    if (error.code === '23503') 
      throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Something went wrong');
  }
}
