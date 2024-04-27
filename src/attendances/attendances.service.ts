import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

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
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id: createAttendanceDto.enrollmentId }
        });

        if (!enrollment) {
            throw new NotFoundException(`Enrollment not found for id ${createAttendanceDto.enrollmentId}`);
        }

        const attendance = this.attendanceRepository.create({
            ...createAttendanceDto,
            enrollmentId: enrollment, 
            createdBy: { id: userId } 
        });

        try {
            await this.attendanceRepository.save(attendance);
            attendances.push(attendance);
        } catch (error) {
            this.handleDBError(error);
        }
    }

    return attendances;
  }

  findAll() {
    return `This action returns all attendances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
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
