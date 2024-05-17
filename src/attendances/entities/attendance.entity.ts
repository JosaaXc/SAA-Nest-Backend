import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
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
    
    @Column('numeric', {
        precision: 2,
        scale: 1,
        default: 0,
    })
    attendance: number;

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
