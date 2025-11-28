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

  @OneToMany(() => Adolescente, (adolescente) => adolescente.cai)
  adolescentes: Adolescente[];
}
