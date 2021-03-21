import { EntityRepository, getConnection, Repository } from "typeorm";
import { Role } from "../role/role.entity";
import { RoleRepository } from "../role/role.repository";
import { RoleType } from "../role/roletype.enum";
import { UserDetails } from "../user/user.details.entity";
import { User } from "../user/user.entity";
import { SignUpDto } from "./dto";
import { genSalt, hash } from "bcryptjs";

@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    async signUp(signUpDto: SignUpDto){
        const { username, email, password } = signUpDto;
        const user = new User();
        user.username = username;
        user.email = email;

        const roleRepository: RoleRepository = await getConnection().getRepository(Role);

        const defaultRole: Role = await roleRepository.findOne({where: {name: RoleType.GENERAL}});

        user.roles = [defaultRole];

        const details: UserDetails = new UserDetails();
        user.details = details;

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        await user.save();
    }

}