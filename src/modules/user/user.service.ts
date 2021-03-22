import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../shared/entity-status.enum';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
    ) { }

    async get(idUser: number): Promise<ReadUserDto> {
        if (!idUser) {
            throw new BadRequestException('el id es requerido');
        }

        const user: User = await this._userRepository.findOne(idUser, { where: { status: Status.ACTIVE } });

        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }

        return plainToClass(ReadUserDto, user);
    }

    async getAll(): Promise<ReadUserDto[]> {
        const users: User[] = await this._userRepository.find();
        return users.map((user: User) => plainToClass(ReadUserDto, user));
    }

    async update(idUser: number, user: UpdateUserDto): Promise<ReadUserDto> {
        const userExist: User = await this._userRepository.findOne(idUser);
        if (!userExist) {
            throw new NotFoundException('El usuario no existe');
        }

        userExist.username = user.username;

        const updatedUser = await this._userRepository.save(userExist);

        return plainToClass(ReadUserDto, updatedUser);
    }

    async delete(idUser: number): Promise<boolean> {
        const userExist: User = await this._userRepository.findOne(idUser);
        if (!userExist) {
            throw new NotFoundException('El usuario no existe');
        }
        await this._userRepository.update(idUser, { status: Status.INACTIVE });
        return true;
    }

    async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
        const userExist: User = await this._userRepository.findOne(userId, { where: { status: Status.ACTIVE } });
        if (!userExist) {
            throw new NotFoundException('El usuario no existe');
        }

        const roleExist: Role = await this._roleRepository.findOne(roleId, { where: { status: Status.ACTIVE } });
        if (!roleExist) {
            throw new NotFoundException('El rol no existe');
        }

        userExist.roles.push(roleExist);
        await this._userRepository.save(userExist);

        return true;
    }

}
