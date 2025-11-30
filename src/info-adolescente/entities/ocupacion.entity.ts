import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';

@Entity('ocupacion')
export class Ocupacion {
  @ApiProperty({ description: 'Identificador único de Ocupación' })
  @PrimaryGeneratedColumn({ name: 'ocup__id' })
  id: number;

  @ApiProperty({
    description: 'Relación con adolescente',
    type: () => Adolescente,
  })
  @JoinColumn({ name: 'adlc_id' })
  @ManyToOne(() => Adolescente, (adolescente) => adolescente.ocupacion)
  adolescente: Adolescente;

  @ApiProperty({ description: 'Nombre del taller' })
  @Column({ name: 'Taller', length: 255 })
  taller: string;

  @ApiProperty({ description: 'Cantidad de participaciones' })
  @Column({ name: 'Participacion' })
  participacion: number;

  @ApiProperty({ description: 'Nombre del instructor' })
  @Column({ name: 'Instructor', length: 63 })
  instructor: string;

  @ApiProperty({ description: 'Observaciones' })
  @Column({ name: 'Observacion', length: 255 })
  observacion: string;
}
