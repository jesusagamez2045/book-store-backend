import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository
    ) { }

    async get(id: number): Promise<Role> {
        if (!id) {
            throw new BadRequestException('el id es requerido');
        }

        const role: Role = await this._roleRepository.findOne(id, { where: { status: 'A' } });

        if (!role) {
            throw new NotFoundException('El rol no existe');
        }

        return role;
    }

    async getAll(): Promise<Role[]> {
        const roles: Role[] = await this._roleRepository.find();
        return roles;
    }

    async create(role: Role): Promise<Role> {
        const savedRole: Role = await this._roleRepository.save(role);
        return savedRole;
    }

    async update(id: number, role: Role): Promise<void> {
        const existRole: Role = await this._roleRepository.findOne(id);
        if (!existRole) {
            throw new NotFoundException('El rol no existe');
        }
        await this._roleRepository.update(id, role);
    }

    async delete(id: number): Promise<void> {
        const existRole: Role = await this._roleRepository.findOne(id);
        if (!existRole) {
            throw new NotFoundException('El rol no existe');
        }
        await this._roleRepository.update(id, {status: 'I'});
    }
}
