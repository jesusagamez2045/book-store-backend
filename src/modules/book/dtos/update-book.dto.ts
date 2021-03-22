import { IsNotEmpty, IsString } from "class-validator";


export class UpdateBookDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;
}