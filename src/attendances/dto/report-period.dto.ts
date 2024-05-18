import { IsUUID } from 'class-validator';

export class ReportByPeriodDto {
  @IsUUID()
  subjectId: string;
  
  @IsUUID()
  period: string;
}