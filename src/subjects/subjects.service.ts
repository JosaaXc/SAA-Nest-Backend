import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
    return this.subjectRepository.find()
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

    console.log(error);
    throw new InternalServerErrorException('Something went wrong');
  }
}
