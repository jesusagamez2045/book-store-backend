import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('user_details')
export class UserDetails extends BaseEntity {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    @Column({type: 'varchar', nullable: true})
    lastname: string;

    @Column({type: 'varchar',  default: 'A', length: 1})
    status: string;

    @CreateDateColumn({type: 'timestamp',  name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp',  name: 'updated_at'})
    updatedAt: Date;

}