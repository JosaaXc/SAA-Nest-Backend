import { User } from "../../auth/entities/user.entity";
import { Student } from "../../students/entities/student.entity";
import { Subject } from "../../subjects/entities/subject.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: 'enrollments' })
@Unique(['studentId', 'subjectId'])
export class Enrollment {

    @PrimaryGeneratedColumn('uuid')
    id: string; 
    
    @Column('text')
    studentId: string;

    @Column('text')
    subjectId: string;
    
    @Column('text')
    addedBy: string;

    @ManyToOne(() => Student, { 
        eager: true, 
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'studentId' })
    student: Student;

    @ManyToOne(() => Subject, { 
        eager: true, 
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'subjectId' })
    subject: Subject;

    @ManyToOne(() => User, { 
        eager: true, 
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'addedBy' })
    addedByUser: User;
}