import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Canton } from './canton.entity';
@Entity()
export class Provincia {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @ManyToOne(() => Canton, (canton) => canton.provincia)
  cantones: Canton[];
}
