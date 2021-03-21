import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../shared/entity-status.enum';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { UserDetails } from './user.details.entity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
    ) { }

    async get(id: number): Promise<User> {
        if (!id) {
            throw new BadRequestException('el id es requerido');
        }

        const user: User = await this._userRepository.findOne(id, { where: { status: Status.ACTIVE } });

        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }

        return user;
    }

    async getAll(): Promise<User[]> {
        const users: User[] = await this._userRepository.find();
        return users;
    }

    async create(user: User): Promise<User> {
        const details = new UserDetails();
        user.details = details;

        const repo = await getConnection().getRepository(Role);
        const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
        user.roles = [defaultRole];
        const savedUser: User = await this._userRepository.save(user);
        return savedUser;
    }

    async update(id: number, user: User): Promise<void> {
        const userExist: User = await this._userRepository.findOne(id);
        if (!userExist) {
            throw new NotFoundException('El usuario no existe');
        }
        await this._userRepository.update(id, user);
    }

    async delete(id: number): Promise<void> {
        const userExist: User = await this._userRepository.findOne(id);
        if (!userExist) {
            throw new NotFoundException('El usuario no existe');
        }
        await this._userRepository.update(id, { status: Status.INACTIVE });
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
