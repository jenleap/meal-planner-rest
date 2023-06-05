import { IsNumber, IsString } from 'class-validator';

export class MeasureDto {
    @IsString()
    label: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    calories: number;

    @IsNumber()
    carbs: number;

    @IsNumber()
    fat: number;

    @IsNumber()
    protein: number;

}