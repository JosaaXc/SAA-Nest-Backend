import { IsArray, IsIn, IsString, MaxLength, MinLength } from "class-validator";
import { IsInArray } from "../decorators/is-in-array.decorator";

export class CreateSubjectDto {

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsString()
    @IsIn(['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no'])
    grade: string;

    @IsIn(['A', 'B', 'C'])
    @IsString()
    group: string;

    @IsString()
    period: string;

    @IsString({
        each: true
    })
    @IsArray()
    @IsInArray(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'])
    daysGiven: string[];

    @IsString({
        each: true
    })
    @IsArray()
    endTime: string[];

}
