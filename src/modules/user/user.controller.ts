import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorator/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(AuthGuard())
@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @Get(':id')
    @Roles('ADMIN')
    @UseGuards(RoleGuard)
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this._userService.get(id);
        return user;
    }

    @Get()
    async getUsers(): Promise<User[]> {
        const users = await this._userService.getAll();
        return users;
    }

    @Post()
    async createUser(@Body() user: User): Promise<User> {
        const userCreated = await this._userService.create(user);
        return userCreated;
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User): Promise<boolean> {
        const userUpdated = await this._userService.update(id, user);
        return true;
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        await this._userService.delete(id);
        return true;
    }

    @Post('/setrole/:userId/:roleId')
    async setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number): Promise<boolean> {
        return await this._userService.setRoleToUser(userId, roleId);
    }

}
