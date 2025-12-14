import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Familia } from './familia.entity';

@Entity('evento')
export class Evento {
  @ApiProperty({ description: 'Identificador único del evento' })
  @PrimaryGeneratedColumn({ name: 'evfm__id' })
  id: number;

  @ApiProperty({ description: 'Descripción del evento', example: 'Visita' })
  @Column({ type: 'varchar', length: 63, nullable: false })
  descripcion: string;

  // Relación inversa: Un evento puede aparecer en muchos registros de familia
  @OneToMany(() => Familia, (familia) => familia.evento)
  familia: Familia[];
}
