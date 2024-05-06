import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { AttendanceStatus } from "../interfaces/attendance-status.interface";
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'attendances' })
@Unique(['enrollmentId', 'createdAt'])
export class Attendance {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => Enrollment, {
        eager: true,
        
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'enrollmentId' })
    enrollmentId: Enrollment; 
    
    @Column({
        type: 'enum',
        enum: AttendanceStatus,
        default: AttendanceStatus.ABSENT
    })
    attendance: string;

    @Column({ 
        type: 'date', 
        default: () => 'CURRENT_DATE', 
    })
    createdAt: Date;

    @Column({ 
        type: 'time', 
        default: () => 'CURRENT_TIME', 
    })
    creationTime: string;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;

}
