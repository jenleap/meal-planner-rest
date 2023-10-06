import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Recipe } from 'src/entities/recipe.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Step } from 'src/entities/step.entity';
import { imageFileFilter } from 'src/utils/file-helper';
import { RecipeCategory } from 'src/entities/recipe-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Ingredient, Step, RecipeCategory]),
    MulterModule.register({
      dest: './uploads'
    })],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [ RecipesService ]
})
export class RecipesModule {}
