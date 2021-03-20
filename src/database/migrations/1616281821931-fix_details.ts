import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDetails1616281821931 implements MigrationInterface {
    name = 'fixDetails1616281821931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `name` `name` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `lastname` `lastname` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `lastname` `lastname` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `name` `name` varchar(255) NOT NULL");
    }

}
