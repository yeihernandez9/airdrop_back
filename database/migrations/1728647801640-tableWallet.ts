import { MigrationInterface, QueryRunner } from "typeorm";

export class TableWallet1728647801640 implements MigrationInterface {
    name = 'TableWallet1728647801640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "prvate_key" character varying NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_1dcc9f5fd49e3dc52c6d2393c53" UNIQUE ("address"), CONSTRAINT "UQ_a163071a294203968a99deb759b" UNIQUE ("prvate_key"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1dcc9f5fd49e3dc52c6d2393c5" ON "wallet" ("address") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a163071a294203968a99deb759" ON "wallet" ("prvate_key") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "wallet_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_67abb81dc33e75d1743323fd5db" UNIQUE ("wallet_id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e9a87388523f59c099c5085b8fb"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "datail_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e9a87388523f59c099c5085b8fb" FOREIGN KEY ("datail_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_67abb81dc33e75d1743323fd5db" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_67abb81dc33e75d1743323fd5db"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e9a87388523f59c099c5085b8fb"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "datail_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e9a87388523f59c099c5085b8fb" FOREIGN KEY ("datail_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_67abb81dc33e75d1743323fd5db"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "wallet_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a163071a294203968a99deb759"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dcc9f5fd49e3dc52c6d2393c5"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
