import { IsNotEmpty, IsString } from "class-validator";


export class CreateBookDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly authors: number[];
}