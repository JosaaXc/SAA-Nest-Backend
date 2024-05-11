import { IsIn, IsNumber, IsUUID } from "class-validator";

export class CreateAttendanceDto {

    @IsUUID()
    enrollmentId: string;

    @IsNumber()
    @IsIn([1,0.5,0.25,0])
    attendance: number;

}
