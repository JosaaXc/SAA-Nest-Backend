import { User } from "../../auth/entities/user.entity";
import { Period } from "../../periods/entities/period.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, Unique, BeforeUpdate, JoinColumn } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

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

    @ManyToOne(() => Period, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'period' })
    period: Period;

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
        if (this.name) {
            this.name = this.name.toLowerCase().replace(/ /g, '-').trim();
        } else {
            throw new BadRequestException('Name is required');
        }
    }

    @BeforeUpdate()
    checkNameBeforeUpdate(){
        this.checkNameBeforeInsert();
    }

}
