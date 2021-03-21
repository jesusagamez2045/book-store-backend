import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@UseGuards(AuthGuard())
@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService){}

    @Get(':id')
    async getRole(@Param('id', ParseIntPipe) id: number) : Promise<Role> {
        const role = await this._roleService.get(id);
        return role;
    }

    @Get()
    async getRoles() : Promise<Role[]> {
        const roles = await this._roleService.getAll();
        return roles;
    }

    @Post()
    async createRole(@Body() role: Role) : Promise<Role> {
        const roleCreated = await this._roleService.create(role);
        return roleCreated;
    }

    @Patch(':id')
    async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role) : Promise<boolean> {
        const roleUpdated = await this._roleService.update(id, role);
        return true;
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseIntPipe) id: number) : Promise<boolean> {
        await this._roleService.delete(id);
        return true;
    }

}
