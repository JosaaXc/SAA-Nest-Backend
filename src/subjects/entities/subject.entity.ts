import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, BeforeInsert, Unique, BeforeUpdate } from 'typeorm';

@Entity()
@Unique(['name', 'group', 'grade'])
export class Subject {
    
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column('text')
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
        eager: true,
        onDelete: 'CASCADE'
      })
    user: User;

    @BeforeInsert()
    checkNameBeforeInsert(){
        this.name = this.name.toLowerCase().replace(/ /g, '-').trim();
    }

    @BeforeUpdate()
    checkNameBeforeUpdate(){
        this.name = this.name.toLowerCase().replace(/ /g, '-').trim();
    }

}
