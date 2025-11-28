import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cai } from 'src/localidades/entities/cai.entity';
import { Nacionalidad } from 'src/parametros/entities/nacionalidad.entity';
import { EstadoCivil } from 'src/parametros/entities/estadoCivil';
import { Gdos } from 'src/parametros/entities/gdos';
import { Etnia } from 'src/parametros/entities/etnia.entity';
import { Canton } from 'src/localidades/entities/canton.entity';

@Entity()
export class Adolescente {
  @ApiProperty({ description: 'Identificador único del adolescente' })
  @PrimaryGeneratedColumn()
  id: number;

  //Tablas externas
  @ManyToOne(() => Cai, (cai) => cai.adolescentes)
  cai: Cai;

  @ManyToOne(() => Nacionalidad, (nacionalidad) => nacionalidad.adolescentes)
  nacionalidad: Nacionalidad;

  @ManyToOne(() => EstadoCivil, (estadoCivil) => estadoCivil.adolescentes)
  estadoCivil: EstadoCivil;

  @ManyToOne(() => Gdos, (gdos) => gdos.adolescentes)
  gdos: Gdos;

  @ManyToOne(() => Etnia, (etnia) => etnia.adolescentes)
  etnia: Etnia;

  @ManyToOne(() => Canton, (canton) => canton.adolescentes)
  canton: Canton;

  // Campos de la tabla
  @ApiProperty({ description: 'Nombre del adolescente', example: 'Juan' })
  @Column({ length: 31 })
  nombre: string;

  @ApiProperty({ description: 'Apellido del adolescente', example: 'Perez' })
  @Column({ length: 31 })
  apellido: string;

  @ApiProperty({
    //Especificaciones para swagger
    description: 'Fecha de nacimiento del adolescente',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date' })
  fecha_nac: Date;

  @ApiProperty({
    description: 'Número de hijos del adolescente (si los tiene)',
    example: '2',
  })
  @Column()
  hijos: number;

  @ApiProperty({
    //Especificaciones para swagger
    description: 'Fecha de ingreso del adolescente al sistema',
    example: '2018-07-10',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date' })
  fecha_ingr: Date;

  @ApiProperty({ description: 'Cédula del adolescente', example: '1714875214' })
  @Column({ length: 31 })
  cedula: string;

  @ApiProperty({
    description: 'Hijo privado de la libertad (boolean)',
    example: '1',
  })
  @Column({ length: 1 })
  hijoPpl: string;

  @ApiProperty({
    description: 'Reincide en el sistema (boolean)',
    example: '0',
  })
  @Column({ length: 1 })
  reincide: string;

  @ApiProperty({
    description: 'Observaciones',
    example: 'El adolescente presenta comportamiento...',
  })
  @Column({ length: 255 })
  observaciones: string;
}
