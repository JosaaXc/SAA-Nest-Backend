import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', {
        nullable: false,
    })
    fullName: string;

    @Column('text', {
        nullable: false,
        unique: true,
    })
    matricula: string;
}
