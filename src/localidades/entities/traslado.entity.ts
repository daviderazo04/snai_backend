import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cai } from './cai.entity';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';

import { ApiProperty } from '@nestjs/swagger';
import { Estado } from '../../common/enums/estado.enum';

@Entity()
export class Traslado {
  @ApiProperty({ description: 'Identificador único del traslado' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'CAI al que se realiza el traslado',
    type: () => Cai,
  })
  @ManyToOne(() => Cai, (cai) => cai.traslados)
  cai: Cai;

  @ApiProperty({
    description: 'Adolescente que es trasladado',
    type: () => Adolescente,
  })
  @ManyToOne(() => Adolescente, (adolescente) => adolescente.traslados)
  adolecente: Adolescente;

  @ApiProperty({
    description: 'Fecha del traslado',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @Column()
  fecha: Date;

  @ApiProperty({
    description: 'Observaciones del traslado',
    example: 'Traslado por razones de seguridad',
  })
  @Column()
  observaciones: string;
  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
  })
  estado: Estado;
}
