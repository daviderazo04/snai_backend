import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Estado } from '../../common/enums/estado.enum';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';

@Entity()
export class Nacionalidad {
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
  @OneToMany(() => Adolescente, (adolescente) => adolescente.nacionalidad)
  adolescentes: Adolescente[];
}
