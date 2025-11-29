import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Estado } from '../../common/enums/estado.enum';
import { Representante } from 'src/adolescente/entities/representante.entity';

@Entity()
export class Parentesco {
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

  @OneToMany(() => Representante, (representante) => representante.parentesco)
  representantes: Representante[];
}
