import { IsString } from "class-validator";

export class CreatePeriodDto {
    
    @IsString()
    name: string;

}
