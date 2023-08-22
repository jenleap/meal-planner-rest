import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from 'src/entities/food.entity';
import { FoodsService } from './foods.service';
import { FoodRecipe } from 'src/entities/food-recipe';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Food, FoodRecipe]), RecipesModule],
  controllers: [FoodsController],
  providers: [FoodsService]
})
export class FoodsModule {}
