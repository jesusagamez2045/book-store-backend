import {MigrationInterface, QueryRunner} from "typeorm";

export class secondMigration1616210147766 implements MigrationInterface {
    name = 'secondMigration1616210147766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_details` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `lastname` varchar(255) NOT NULL, `status` varchar(1) NOT NULL DEFAULT 'A', `created_at` timestamp NOT NULL, `updated_at` timestamp NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `roles` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `status` varchar(1) NOT NULL DEFAULT 'A', `created_at` timestamp NOT NULL, `updated_at` timestamp NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_roles` (`usersId` int NOT NULL, `rolesId` int NOT NULL, INDEX `IDX_99b019339f52c63ae615358738` (`usersId`), INDEX `IDX_13380e7efec83468d73fc37938` (`rolesId`), PRIMARY KEY (`usersId`, `rolesId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `users` ADD `status` varchar(1) NOT NULL DEFAULT 'A'");
        await queryRunner.query("ALTER TABLE `users` CHANGE `created_at` `created_at` timestamp NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `updated_at` `updated_at` timestamp NOT NULL");
        await queryRunner.query("ALTER TABLE `user_roles` ADD CONSTRAINT `FK_99b019339f52c63ae6153587380` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_roles` ADD CONSTRAINT `FK_13380e7efec83468d73fc37938e` FOREIGN KEY (`rolesId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_roles` DROP FOREIGN KEY `FK_13380e7efec83468d73fc37938e`");
        await queryRunner.query("ALTER TABLE `user_roles` DROP FOREIGN KEY `FK_99b019339f52c63ae6153587380`");
        await queryRunner.query("ALTER TABLE `users` CHANGE `updated_at` `updated_at` timestamp NOT NULL DEFAULT ''0000-00-00 00:00:00''");
        await queryRunner.query("ALTER TABLE `users` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `users` ADD `status` varchar(8) NOT NULL DEFAULT ''ACTIVE''");
        await queryRunner.query("DROP INDEX `IDX_13380e7efec83468d73fc37938` ON `user_roles`");
        await queryRunner.query("DROP INDEX `IDX_99b019339f52c63ae615358738` ON `user_roles`");
        await queryRunner.query("DROP TABLE `user_roles`");
        await queryRunner.query("DROP TABLE `roles`");
        await queryRunner.query("DROP TABLE `user_details`");
    }

}
