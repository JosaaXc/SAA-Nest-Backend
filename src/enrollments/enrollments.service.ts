import { Injectable, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { CreateEnrollmentDto, DeleteEnrollmentDto } from './dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class EnrollmentsService {

  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
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

  async findStudentsEnrolled(subjectId: string, paginationDto:PaginationDto ) {
     const {limit = 10, offset = 0} = paginationDto; 

    try {
      const enrollments = await this.enrollmentRepository.find({
        where: { subjectId },
        relations: ['student'], 
        take: limit,
        skip: offset,
      });

      return enrollments.map(enrollment => ({
        enrollmentId: enrollment.id,
        ...enrollment.student,
      }));
    } catch (error) {
      handleDBError(error);
    }
  }

  async countStudentsEnrolled(subjectId: string) {
    try {
      const count = await this.enrollmentRepository.count({ where: { subjectId } });
      return { count };
    } catch (error) {
      handleDBError(error);
    }
  }

  async findStudentsNotEnrolled(subjectId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const enrollments = await this.enrollmentRepository.find({
        where: { subjectId },
        select: ['studentId'],
      });
      const enrolledStudentIds = enrollments.map(enrollment => enrollment.studentId);
      if(enrolledStudentIds.length === 0) return await this.studentRepository.find();

      const studentsNotEnrolled = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.id NOT IN (:...enrolledStudentIds)', { enrolledStudentIds })
        .take(limit)
        .skip(offset)
        .getMany();

      return studentsNotEnrolled;

    } catch (error) {
      handleDBError(error);
    }
  }

  async countStudentsNotEnrolled(subjectId: string) {
    try {
      const paginationDto = { limit: 10, offset: 0 };
      const studentsNotEnrolled = await this.findStudentsNotEnrolled(subjectId, paginationDto);
      return { count: studentsNotEnrolled.length };
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
