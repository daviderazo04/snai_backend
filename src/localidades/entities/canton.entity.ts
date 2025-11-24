import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Provincia } from './provincia.entity';

@Entity()
export class Canton {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @ManyToOne(() => Provincia, (provincia) => provincia.cantones)
  provincia: Provincia;
}
