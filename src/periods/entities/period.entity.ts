import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}