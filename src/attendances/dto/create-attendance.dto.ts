import { IsEnum, IsUUID } from "class-validator";
import { AttendanceStatus } from "../interfaces/attendance-status.interface";

export class CreateAttendanceDto {

    @IsUUID()
    enrollmentId: string;

    @IsEnum(AttendanceStatus)
    attendance: string;

}
