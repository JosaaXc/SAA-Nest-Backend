import { IsString, IsUUID } from "class-validator";

export class CreateEnrollmentDto {

    @IsString()
    @IsUUID()
    studentId: string;
    
}
