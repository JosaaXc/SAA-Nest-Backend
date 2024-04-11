import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Subject {
    
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column('text', {
        unique: true
    })
    name: string;

    @Column('text')
    grade: string;

    @Column('text')
    group: string;

    @Column('text')
    period: string;

    @Column('text', {
        array: true,
        default: []
    })
    daysGiven: string[];

    @Column('text', {
        array: true,
        default: []
    })
    endTime: string[];

    @ManyToOne(() => User, user => user.subject, {
        onDelete: 'CASCADE'
      })
    user: User;

    @BeforeInsert()
    checkNameBeforeInsert(){
        this.name = this.name.toLowerCase().replace(/ /g, '-').trim();
    }

}
