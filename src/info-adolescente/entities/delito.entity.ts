import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Juridico } from './juridico.entity';

@Entity('delito') // Nombre de la tabla en base de datos
export class Delito {
  @ApiProperty({ description: 'Identificador único del delito' })
  @PrimaryGeneratedColumn({ name: 'dlto__id' })
  id: number;

  @ApiProperty({ description: 'Nombre del delito', example: 'Robo' })
  @Column({ name: 'nombre', type: 'varchar', length: 63, nullable: false })
  nombre: string;

  // Relación inversa: Un delito puede aparecer en muchos registros jurídicos
  @OneToMany(() => Juridico, (juridico) => juridico.delito)
  juridico: Juridico[];
}
