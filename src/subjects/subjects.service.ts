import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { RelationQueryBuilder, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SubjectsService {

  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}


  async create(createSubjectDto: CreateSubjectDto, user: User) {

    try{
      const subject = this.subjectRepository.create({
        ...createSubjectDto,
        user
      });

      await this.subjectRepository.save(subject);
      return subject;
      
    }catch(error){
      this.handleDBError(error);
    }

  }

  findAll() {
    return `This action returns all subjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
  
  private handleDBError(error: any): never {
    if( error.code === '23505') {
      throw new BadRequestException( error.detail )
    }

    console.log(error);
    throw new InternalServerErrorException('Something went wrong');
  }
}
