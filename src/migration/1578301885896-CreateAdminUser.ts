import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entity/User";

export class CreateAdminUser1578301885896 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.username = "admin";
        user.password = "peace";
        user.hashPassword();
        user.role = "ADMIN";
        const userRepository = getRepository(User);
        await userRepository.save(user);
      }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
