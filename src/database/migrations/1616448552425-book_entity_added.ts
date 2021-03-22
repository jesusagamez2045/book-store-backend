import {MigrationInterface, QueryRunner} from "typeorm";

export class bookEntityAdded1616448552425 implements MigrationInterface {
    name = 'bookEntityAdded1616448552425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `books` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `description` varchar(255) NULL, `status` varchar(1) NOT NULL DEFAULT 'A', `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_books` (`usersId` int NOT NULL, `booksId` int NOT NULL, INDEX `IDX_e8384931aac8ac91dda9d1f83c` (`usersId`), INDEX `IDX_feb9d8083aefec5c5cc9208263` (`booksId`), PRIMARY KEY (`usersId`, `booksId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `name` `name` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `lastname` `lastname` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user_books` ADD CONSTRAINT `FK_e8384931aac8ac91dda9d1f83c8` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_books` ADD CONSTRAINT `FK_feb9d8083aefec5c5cc9208263c` FOREIGN KEY (`booksId`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_books` DROP FOREIGN KEY `FK_feb9d8083aefec5c5cc9208263c`");
        await queryRunner.query("ALTER TABLE `user_books` DROP FOREIGN KEY `FK_e8384931aac8ac91dda9d1f83c8`");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `lastname` `lastname` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `name` `name` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("DROP INDEX `IDX_feb9d8083aefec5c5cc9208263` ON `user_books`");
        await queryRunner.query("DROP INDEX `IDX_e8384931aac8ac91dda9d1f83c` ON `user_books`");
        await queryRunner.query("DROP TABLE `user_books`");
        await queryRunner.query("DROP TABLE `books`");
    }

}
