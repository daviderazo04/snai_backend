import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Canton } from './canton.entity';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';
import { Estado } from '../../common/enums/estado.enum';
import { Traslado } from './traslado.entity';

@Entity()
export class Cai {
  @ApiProperty({ description: 'Identificador único del CAI' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Cantón al que pertenece el CAI',
    type: () => Canton,
  })
  @ManyToOne(() => Canton, (canton) => canton.cais)
  canton: Canton;

  @ApiProperty({ description: 'Nombre del CAI', example: 'CAI Central' })
  @Column()
  nombre: string;

  @OneToMany(() => Traslado, (traslado) => traslado.toCai)
  traslados: Traslado[];
  @OneToMany(() => Adolescente, (adolescente) => adolescente.cai)
  adolescentes: Adolescente[];
  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
  })
  estado: Estado;
}
