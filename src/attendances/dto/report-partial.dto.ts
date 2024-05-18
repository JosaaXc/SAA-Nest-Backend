import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

export class ReportPartialDto {
    @IsUUID()
    subjectId: string;
  
    @IsNotEmpty()
    @IsDateString()
    startDate: string;
  
    @IsNotEmpty()
    @IsDateString()
    finishDate: string;
}