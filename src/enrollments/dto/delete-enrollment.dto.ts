import { IsString, IsUUID } from "class-validator";

export class DeleteEnrollmentDto {
  
  @IsString()
  @IsUUID()
  enrollmentId: string;

}
