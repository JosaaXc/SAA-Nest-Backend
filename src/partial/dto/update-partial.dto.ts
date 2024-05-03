import { PartialType } from '@nestjs/mapped-types';
import { CreatePartialDto } from './create-partial.dto';

export class UpdatePartialDto extends PartialType(CreatePartialDto) {}
