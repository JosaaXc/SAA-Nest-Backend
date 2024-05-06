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
    
    @Column({ 
        type: 'date', 
        unique: true,
    })
    startDate: Date;
    
    @Column({ 
        type: 'date', 
        unique: true,
    })
    finishDate: Date; 

}
