import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity() 
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    correo:string;

    @Column()
    contraseña:string;

    @Column()
    nombre:string

    @Column()
    apellido:string;
}
