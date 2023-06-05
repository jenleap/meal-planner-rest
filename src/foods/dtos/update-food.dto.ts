import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFoodDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    brand: string;

    @IsString()
    @IsOptional()
    metricMeasure: string;

    @IsNumber()
    @IsOptional()
    metricAmount: number;

    @IsString()
    @IsOptional()
    imperialMeasure: string;

    @IsNumber()
    @IsOptional()
    imperialAmount: number;

    @IsNumber()
    @IsOptional()
    calories: number;

    @IsNumber()
    @IsOptional()
    carbs: number;

    @IsNumber()
    @IsOptional()
    fat: number;

    @IsNumber()
    @IsOptional()
    protein: number;
}