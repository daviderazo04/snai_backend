import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Estado } from '../../common/enums/estado.enum';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';
import { Representante } from 'src/adolescente/entities/representante.entity';

@Entity()
export class Nacionalidad {
  @ApiProperty({ description: 'Identificador de la nacionalidad', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la nacionalidad', example: 'Ecuador' })
  @Column()
  nombre: string;
  @ApiProperty({
    description: 'Estado de la nacionalidad',
    enum: Estado,
    example: Estado.ACTIVO,
  })
  @Column({
    type: 'enum',
    enum: Estado,
    array: false,
    default: Estado.ACTIVO,
  })
  estado: Estado;

  @OneToMany(() => Adolescente, (adolescente) => adolescente.nacionalidad)
  adolescentes: Adolescente[];

  @OneToMany(() => Representante, (representante) => representante.nacionalidad)
  representantes: Representante[];
}
