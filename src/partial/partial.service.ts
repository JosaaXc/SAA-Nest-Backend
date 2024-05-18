import { Injectable } from '@nestjs/common';
import { CreatePartialDto } from './dto/create-partial.dto';
import { UpdatePartialDto } from './dto/update-partial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partial } from './entities/partial.entity';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class PartialService {

  constructor(
    @InjectRepository(Partial)
    private partialRepository: Repository<Partial>,
  ) { }

  async create(createPartialDto: CreatePartialDto) {
    try {
      const { period, ...createPartial} = createPartialDto; 
      const partial = this.partialRepository.create({ 
        ...createPartial, 
        period: { id: period }
      })
      return await this.partialRepository.save(partial)

    } catch (error) {
      handleDBError(error);
    }
  }

  findAll() {
    return this.partialRepository.find()
  }

  findOne(id: string ) {
    try {
      return this.partialRepository.findOneOrFail({ where: { id } })
    } catch (error) {
      handleDBError(error)
    }
  }

  async update(id: string , updatePartialDto: UpdatePartialDto) {

    try {
      
      const partial = await this.partialRepository.findOneOrFail({ where: { id } })
      const updatedPartial = this.partialRepository.merge(partial, { ...updatePartialDto, period: { id: updatePartialDto.period } })
      return await this.partialRepository.save(updatedPartial)

    } catch (error) {
      handleDBError(error)
    }
  }

  async remove(id: string) {
    try {
      await this.partialRepository.delete(id)
      return { message: `Partial with id ${id} eliminated`}
    } catch (error) {
      handleDBError(error)
    }
  }
}
