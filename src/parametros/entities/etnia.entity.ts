import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Estado } from '../../common/enums/estado.enum';

@Entity()
export class Etnia {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @Column({
    type: 'enum',
    enum: Estado,
    array: false,
    default: Estado.ACTIVO,
  })
  estado: Estado;
}
