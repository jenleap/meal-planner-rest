import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from 'src/entities/meal';
import { MealTag } from 'src/entities/meal-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, MealTag])],
  controllers: [MealsController],
  providers: [MealsService]
})
export class MealsModule {}
