import { IsString, IsBoolean, IsArray } from 'class-validator';
import { MeasureDto } from './measure.dto';

export class CreateFoodDto {
    @IsString()
    name: string;

    @IsString()
    brand: string;

    @IsArray()
    measures: MeasureDto[]

    @IsBoolean()
    isFood: boolean;
}