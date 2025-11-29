import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Provincia } from './provincia.entity';
import { Cai } from './cai.entity';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';
import { Representante } from 'src/adolescente/entities/representante.entity';

@Entity()
export class Canton {
  @ApiProperty({ description: 'Identificador único del cantón' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del cantón', example: 'Quito' })
  @Column()
  nombre: string;

  @ApiProperty({
    description: 'Provincia a la que pertenece el cantón',
    type: () => Provincia,
  })
  @ManyToOne(() => Provincia, (provincia) => provincia.cantones)
  provincia: Provincia;
  @OneToMany(() => Cai, (cai) => cai.canton)
  cais: Cai[];
  @OneToMany(() => Adolescente, (adolescente) => adolescente.canton)
  adolescentes: Adolescente[];

  @OneToMany(() => Representante, (representante) => representante.canton)
  representantes: Canton[];
}
