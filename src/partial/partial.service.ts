import { Injectable } from '@nestjs/common';
import { CreatePartialDto } from './dto/create-partial.dto';
import { UpdatePartialDto } from './dto/update-partial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partial } from './entities/partial.entity';
import { Repository } from 'typeorm';
import { handleDBError } from 'src/common/errors/handleDBError.errors';

@Injectable()
export class PartialService {

  constructor(
    @InjectRepository(Partial)
    private partialRepository: Repository<Partial>,
  ) { }

  async create(createPartialDtos: CreatePartialDto[]) {
    try {
      const partials = createPartialDtos.map(dto => this.partialRepository.create(dto));
      const savedPartials = await Promise.all(partials.map(partial => this.partialRepository.save(partial)));
      return savedPartials;
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
      const updatedPartial = this.partialRepository.merge(partial, updatePartialDto)
      await this.partialRepository.save(updatedPartial)
      return updatedPartial

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
