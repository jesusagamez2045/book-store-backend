import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('books')
export class Book extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', nullable: false})
    title: string;

    @Column({type: 'varchar', nullable: true})
    description: string;

    @ManyToMany(type => User, user => user.books, {eager: true})
    @JoinColumn()
    authors: User[];

    @Column({type: 'varchar',  default: 'A', length: 1})
    status: string;

    @CreateDateColumn({type: 'timestamp',  name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp',  name: 'updated_at'})
    updatedAt: Date;
}