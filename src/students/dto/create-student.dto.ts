import { IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateStudentDto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    fullName: string;

    @IsNumberString()
    matricula: string;

}
