import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class EnrollmentsService {

  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}
  
  async create(subjectId: string, createEnrollmentDtos: CreateEnrollmentDto[], userId: string) {
    const enrollments = createEnrollmentDtos.map(enrollment => {
      return this.enrollmentRepository.create({
        ...enrollment,
        subjectId,
        addedBy: userId
      });
    });

    try {
      await this.enrollmentRepository.save(enrollments);
    } catch (error) {
      handleDBError(error);
    }

    const enrollmentsWithStudents = await Promise.all(
      enrollments.map(enrollment => 
        this.enrollmentRepository.findOne({ where: { id: enrollment.id }, relations: ['student'] })
      )
    );

    return enrollmentsWithStudents.map(enrollment => enrollment.student);

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10 , offset = 0 } = paginationDto;
  
    const enrollments = await this.enrollmentRepository.find({
      take: limit,
      skip: offset,
    });
  
    return enrollments.map(({ studentId, subjectId, addedBy, ...enrollment }) => enrollment);
  }

  async findBySubject(subjectId: string) {
    try {
      const enrollments = await this.enrollmentRepository.find({
        where: { subjectId },
        relations: ['student']
      });

      return enrollments.map(enrollment => ({
        enrollmentId: enrollment.id,
        ...enrollment.student,
      }));
    } catch (error) {
      handleDBError(error);
    }
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

}
