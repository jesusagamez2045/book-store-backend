import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsNumber, IsString } from "class-validator";
import { ReadRoleDto } from "../../role/dtos";
import { ReadUserDetailDto } from "./read-user-details.dto";

@Exclude()
export class ReadUserDto {

    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsEmail()
    readonly email: string;

    @Expose()
    @IsString()
    readonly username: string;

    @Expose()
    @Type(type => ReadUserDetailDto)
    readonly details: ReadUserDetailDto;

    @Expose()
    @Type(type => ReadRoleDto)
    readonly roles: ReadRoleDto[];
}