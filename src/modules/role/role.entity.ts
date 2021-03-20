import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'varchar', nullable: false})
    description: string;

    @ManyToMany(type => User, user => user.roles)
    @JoinColumn()
    users: User[];

    @Column({type: 'varchar',  default: 'A', length: 1})
    status: string;

    @CreateDateColumn({type: 'timestamp',  name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp',  name: 'updated_at'})
    updatedAt: Date;
}