import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { RelationQueryBuilder, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

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
      this.handleDBError(error);
    }
  }


  findManyByUser(userId: string) {
    // return all the subjects that belong to the user
    try {
      return this.subjectRepository.createQueryBuilder('subject')
        .innerJoin('subject.user', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async update(id: string, user: User, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.findOne({ where: {id }})

    if(!subject){
      throw new BadRequestException('Subject not found');
    }

    if( subject.user.id !== user.id ){
      throw new UnauthorizedException('You cannot update this subject');
    }

    this.subjectRepository.merge(subject, updateSubjectDto);

    try{
      await this.subjectRepository.save(subject);
      return subject;
    }catch(error){
      this.handleDBError(error);
    }

  }

  remove(id: string) {
    return this.subjectRepository.delete({ id });
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
