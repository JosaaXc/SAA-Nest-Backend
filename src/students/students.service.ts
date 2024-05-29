import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ){}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    
    return this.studentRepository.save(student)
      .catch( error => handleDBError(error) )
  }

  findAll( paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.studentRepository.find({
      take: limit,
      skip: offset,
    });
  }

  countStudents() {
    return this.studentRepository.count();
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } })
      .catch( error => handleDBError(error) )
    
    if (!student) 
        throw new NotFoundException(`Student with ID ${id} not found`);

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id); 

    const updatedStudent = this.studentRepository.merge(student, updateStudentDto);

    return this.studentRepository.save(updatedStudent)
      .catch( error => handleDBError(error) );
  }

  async remove(id: string) {
    const result = await this.studentRepository.delete({ id })
      .catch( error => handleDBError(error) );

    if (result.affected === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return { message: `Student with ID ${id} has been deleted` };
  }
}
