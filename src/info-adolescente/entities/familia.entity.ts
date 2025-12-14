import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';
import { Evento } from './evento.entity';

@Entity('familia')
export class Familia {
  @ApiProperty({ description: 'Identificador único de Familia' })
  @PrimaryGeneratedColumn({ name: 'faml__id' })
  id: number;

  @ApiProperty({
    description: 'Relación con adolescente',
    type: () => Adolescente,
  })
  @JoinColumn({ name: 'adlc__id' })
  @ManyToOne(() => Adolescente, (adolescente) => adolescente.familia)
  adolescente: Adolescente;

  @ApiProperty({
    description: 'Relación con evento',
    type: () => Evento,
  })
  @JoinColumn({ name: 'evfm__id' })
  @ManyToOne(() => Evento, (evento) => evento.familia)
  evento: Evento;

  @ApiProperty({
    description: 'Fecha de interacción con la familia',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'Fecha', type: 'date' })
  fecha: Date;

  @ApiProperty({ description: 'Detalle de la interacción' })
  @Column({ name: 'Detalle', length: 255 })
  detalle: string;
}
