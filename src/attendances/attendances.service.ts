import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class AttendancesService {

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>, 
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment> 
  ){}

  async create(createAttendanceDtos: CreateAttendanceDto[], userId: string) {
    const attendances = [];

    for (const createAttendanceDto of createAttendanceDtos) {
        const attendance = this.attendanceRepository.create({
            ...createAttendanceDto,
            enrollmentId: { id: createAttendanceDto.enrollmentId }, 
            createdBy: { id: userId } 
        });
        try {
          await this.attendanceRepository.save(attendance);
          delete attendance.createdBy;
          attendances.push(attendance);
        } catch (error) {
          handleDBError(error);
        }
    }

    return attendances;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const attendances = await this.attendanceRepository.find({
        take: limit,
        skip: offset
    });

    return attendances.map(attendance => ({
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
        student: {
            id: attendance.enrollmentId.student.id,
            fullName: attendance.enrollmentId.student.fullName,
            matricula: attendance.enrollmentId.student.matricula,
        },
    }));
  }

  async findManyByDateAndSubject(date: string, subjectId: string) {
    const attendances = await this.attendanceRepository.createQueryBuilder('attendance')
      .innerJoinAndSelect('attendance.enrollmentId', 'enrollment')
      .innerJoinAndSelect('enrollment.subject', 'subject')
      .innerJoinAndSelect('enrollment.student', 'student')
      .where('attendance.createdAt = :date', { date })
      .andWhere('subject.id = :subjectId', { subjectId })
      .getMany();

    if (attendances.length === 0) 
      throw new NotFoundException(`Attendances not found for date ${date} and subjectId ${subjectId}`);
    
    try {
      return attendances.map(attendance => ({
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
        student: {
          id: attendance.enrollmentId.student.id,
          fullName: attendance.enrollmentId.student.fullName,
          matricula: attendance.enrollmentId.student.matricula,
        },
      }));
    } catch (error) {
      handleDBError(error);
    }
  }

  async findManyBySubject(subjectId: string) {
    const attendances = await this.attendanceRepository.createQueryBuilder('attendance')
      .innerJoinAndSelect('attendance.enrollmentId', 'enrollment')
      .innerJoinAndSelect('enrollment.subject', 'subject')
      .innerJoinAndSelect('enrollment.student', 'student')
      .where('subject.id = :subjectId', { subjectId })
      .getMany();

    if (attendances.length === 0) 
      throw new NotFoundException(`Attendances not found for subjectId ${subjectId}`);
    
    try {
      return attendances.map(attendance => ({
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
        student: {
          id: attendance.enrollmentId.student.id,
          fullName: attendance.enrollmentId.student.fullName,
          matricula: attendance.enrollmentId.student.matricula,
        },
      }));
    } catch (error) {
      handleDBError(error);
    }
  }

  // function to find attendances by student's enrollmentId
  async findManyByEnrollment(enrollmentId: string) {
    
    const attendances = await this.attendanceRepository.find({
      where: { enrollmentId: { id: enrollmentId } },
    });

    if (attendances.length === 0) 
      throw new NotFoundException(`Attendances not found for enrollmentId ${enrollmentId}`);
    
    try {

      return attendances.map(attendance => ({
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
      }));

    } catch (error) {
      handleDBError(error);
    }
  }

  async findAttendanceDatesBySubject(subjectId: string) {
    const attendanceDates = await this.attendanceRepository.createQueryBuilder('attendance')
      .innerJoinAndSelect('attendance.enrollmentId', 'enrollment')
      .where('enrollment.subjectId = :subjectId', { subjectId })
      .select('DISTINCT(attendance.createdAt)', 'createdAt')
      .getRawMany();
    return attendanceDates.map(attendance => {
        const date = new Date(attendance.createdAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
  }

  async findOne(id: string) {
    try{
      const attendance = await this.attendanceRepository.findOneOrFail({ where: { id } });
      return {
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
        student: {
          id: attendance.enrollmentId.student.id,
          fullName: attendance.enrollmentId.student.fullName,
          matricula: attendance.enrollmentId.student.matricula,
        },
      }
    }catch(error){
      handleDBError(error);
    }
  }

  async update (updateAttendanceDtos: UpdateAttendanceDto[]) {
    const attendances = [];
  
    for (const updateAttendanceDto of updateAttendanceDtos) {
      const attendance = await this.attendanceRepository.preload(updateAttendanceDto);
      if (!attendance) 
        throw new BadRequestException(`Attendance with ID ${updateAttendanceDto.id} not found`);
      try {
        await this.attendanceRepository.save(attendance);
        attendances.push(attendance);
      } catch (error) {
        handleDBError(error);
      }
    }
    return attendances;
  }
}
