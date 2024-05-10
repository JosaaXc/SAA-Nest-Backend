import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Partials } from "../interfaces/partials.interfaces.dto";
import { Period } from "../../periods/entities/period.entity";

@Entity()
@Unique(['partial', 'period'])
export class Partial {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({
        type: 'enum',
        enum: Partials,
    })
    partial: string;

    @ManyToOne(() => Period, { eager: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'period'})
    period: Period;

    @Column({ 
        type: 'date', 
    })
    startDate: Date;
    
    @Column({ 
        type: 'date', 
    })
    finishDate: Date; 

}
