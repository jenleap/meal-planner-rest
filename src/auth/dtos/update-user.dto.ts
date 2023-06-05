import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    password: string;
}