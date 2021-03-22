import { IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
    @IsString({message: 'Debe ser una cadena'})
    @MaxLength(50, {message: 'El maximo de caracteres es 50'})
    readonly name: string;

    @IsString({message: 'Debe ser una cadena'})
    @MaxLength(100, {message: 'El maximo de caracteres es 100'})
    readonly description: string;
}