import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString, MaxLength } from "class-validator";

@Exclude()
export class ReadRoleDto {

    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString({message: 'Debe ser una cadena'})
    @MaxLength(50, {message: 'El maximo de caracteres es 50'})
    readonly name: string;

    @Expose()
    @IsString({message: 'Debe ser una cadena'})
    @MaxLength(100, {message: 'El maximo de caracteres es 100'})
    readonly description: string;
}