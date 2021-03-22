import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository
    ) { }

    async get(roleId: number): Promise<ReadRoleDto> {
        if (!roleId) {
            throw new BadRequestException('el id es requerido');
        }

        const role: Role = await this._roleRepository.findOne(roleId, { where: { status: 'A' } });

        if (!role) {
            throw new NotFoundException('El rol no existe');
        }

        return plainToClass(ReadRoleDto, role);
    }

    async getAll(): Promise<ReadRoleDto[]> {
        const roles: Role[] = await this._roleRepository.find();
        return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
    }

    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        const savedRole: Role = await this._roleRepository.save(role);
        return plainToClass(ReadRoleDto, savedRole);
    }

    async update(roleId: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
        const existRole: Role = await this._roleRepository.findOne(roleId);
        if (!existRole) {
            throw new NotFoundException('El rol no existe');
        }

        existRole.name = role.name;
        existRole.description = role.description;

        const updatedRole: Role = await this._roleRepository.save(existRole);

        return plainToClass(ReadRoleDto, updatedRole);
    }

    async delete(roleId: number): Promise<void> {
        const existRole: Role = await this._roleRepository.findOne(roleId);
        if (!existRole) {
            throw new NotFoundException('El rol no existe');
        }
        await this._roleRepository.update(roleId, {status: 'I'});
    }
}
