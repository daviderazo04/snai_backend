import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Estado } from '../../common/enums/estado.enum';
import { Representante } from 'src/adolescente/entities/representante.entity';

@Entity()
export class Parentesco {
  @ApiProperty({ description: 'Identificador del parentesco', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del parentesco', example: 'Padre' })
  @Column()
  nombre: string;
  @ApiProperty({ description: 'Estado del registro', enum: Estado })
  @Column({
    type: 'enum',
    enum: Estado,
    array: false,
    default: Estado.ACTIVO,
  })
  estado: Estado;

  @OneToMany(() => Representante, (representante) => representante.parentesco)
  representantes: Representante[];
}
