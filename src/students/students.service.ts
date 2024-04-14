import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ){}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    
    return this.studentRepository.save(student)
      .catch( error => this.handleDBError(error) )
  }

  findAll( paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.studentRepository.find({
      take: limit,
      skip: offset,
      //TODO: Relaciones
    });
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } })
      .catch( error => this.handleDBError(error) )
    
    if (!student) 
        throw new NotFoundException(`Student with ID ${id} not found`);

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id); 

    const updatedStudent = this.studentRepository.merge(student, updateStudentDto);

    return this.studentRepository.save(updatedStudent)
      .catch( error => this.handleDBError(error) );
  }

  async remove(id: string) {
    const result = await this.studentRepository.delete({ id })
      .catch( error => this.handleDBError(error) );

    if (result.affected === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return { message: `Student with ID ${id} has been deleted` };
}

  private handleDBError(error: any): never {
    if( error.code === '23505') {
      throw new BadRequestException( error.detail )
    }

    if( error.code === '0A000') {
      throw new NotFoundException('Resource not found')
    }

    console.log(error);
    throw new InternalServerErrorException('Something went wrong');
  }
}
