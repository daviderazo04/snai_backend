import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Canton } from './canton.entity';
import { Estado } from '../../common/enums/estado.enum';
@Entity()
export class Provincia {
  @ApiProperty({ description: 'Identificador único de la provincia' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la provincia', example: 'Pichincha' })
  @Column()
  nombre: string;

  @ApiProperty({
    description: 'Cantones pertenecientes a la provincia',
    type: () => [Canton],
    isArray: true,
    required: false,
  })
  @OneToMany(() => Canton, (canton) => canton.provincia)
  cantones: Canton[];
  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
  })
  estado: Estado;
}
