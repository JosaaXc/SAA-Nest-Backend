import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class SubjectsService {

  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}


  async create(createSubjectDto: CreateSubjectDto, user: User) {
    
    const { period, ...CreateSubject } = createSubjectDto;
    try{
      
      const subject = this.subjectRepository.create({
        ...CreateSubject,
        period: { id: period },
        user
      });

      await this.subjectRepository.save(subject);
      delete subject.user;
      return subject;
      
    }catch(error){
      handleDBError(error);
    }

  }

  async findAll( paginationDto: PaginationDto) {
    const { limit = 10 , offset = 0 } = paginationDto;
    return this.subjectRepository.find({ 
      take: limit, 
      skip: offset 
    });
  }

  async findOne(id: string) {
    try {
      
      return await this.subjectRepository.findOneOrFail({ where: { id } });

    } catch (error) {
      handleDBError(error);
    }
  }


  findManyByUser(userId: string) {
    // return all the subjects that belong to the user
    try {
      return this.subjectRepository.createQueryBuilder('subject')
        .innerJoin('subject.user', 'user')
        .innerJoinAndSelect('subject.period', 'period')
        .where('user.id = :userId', { userId })
        .getMany();
    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, user: User, updateSubjectDto: UpdateSubjectDto) {

    const subject = await this.subjectRepository.findOneOrFail({ where: {id }})

    if( subject.user.id !== user.id ){
      throw new UnauthorizedException('You cannot update this subject');
    }

    this.subjectRepository.merge(subject, {
      ...updateSubjectDto,
      period: { id: updateSubjectDto.period }
    });

    try{
      const subjectUpload = await this.subjectRepository.save(subject);
      delete subjectUpload.user;
      return subjectUpload;
    }catch(error){
      handleDBError(error);
    }

  }

  remove(id: string) {
    return this.subjectRepository.delete({ id });
  }
  
}
