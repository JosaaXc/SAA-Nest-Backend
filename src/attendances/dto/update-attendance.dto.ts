import { IsEnum, IsUUID } from "class-validator";
import { AttendanceStatus } from "../interfaces/attendance-status.interface";


export class UpdateAttendanceDto {
    @IsUUID()
    id: string;

    @IsEnum(AttendanceStatus)
    attendance: string;
}
