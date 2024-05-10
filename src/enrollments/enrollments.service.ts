import { Injectable, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { CreateEnrollmentDto, DeleteEnrollmentDto } from './dto';

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
  
    return enrollments.map(({ studentId, subjectId, addedBy,subject, addedByUser, ...enrollment }) => enrollment);
  }

  async findStudentsEnrolled(subjectId: string) {
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

    try {
      
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id },
        relations: ['student']
      });
  
      const { studentId, subjectId, addedBy, ...enrollmentData } = enrollment;
      return enrollmentData;
      
    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(deleteEnrollmentDto: DeleteEnrollmentDto[]) {
    try {
      const ids = deleteEnrollmentDto.map(dto => dto.enrollmentId);
      const result = await this.enrollmentRepository.delete(ids);

      if (result.affected === 0) {
        throw new EntityNotFoundError(Enrollment, ids);
      }

      return { message: 'Enrollments deleted successfully' };
    } catch (error) {
      handleDBError(error);
    }
  }
}
