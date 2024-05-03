import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Partials } from "../interfaces/partials.interfaces.dto";

@Entity()
export class Partial {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({
        type: 'enum',
        enum: Partials,
        unique: true,
    })
    partial: string;
    
    @Column('date', {
        nullable: false,
        unique: true,
    })
    startDate: Date; 
    
    @Column('date', {
        nullable: false,
        unique: true,
    })
    finishDate: Date; 

}
