import { Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from 'src/entities/recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeCategory } from 'src/entities/recipe-category.entity';

@Injectable()
export class RecipesService {

    constructor(
        @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
        @InjectRepository(RecipeCategory) private categoryRepo: Repository<RecipeCategory>) {}

    findOne(id: number) {
        //return this.recipeRepo.findOne(id);
        return this.recipeRepo
            .createQueryBuilder("recipe")
            .where("recipe.id = :id", { id })
            .innerJoinAndSelect("recipe.steps", "steps")
            .innerJoinAndSelect("recipe.ingredients", "ingredient")
                .innerJoinAndSelect("ingredient.food", "food")
                    .innerJoinAndSelect("food.measures", "measure")
            .getOne();
    }

    async findAll(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ recipes, total ] = await this.recipeRepo
            .createQueryBuilder("recipe")
            .innerJoinAndSelect("recipe.steps", "steps")
            .innerJoinAndSelect("recipe.ingredients", "ingredient")
                .innerJoinAndSelect("ingredient.food", "food")
                    .innerJoinAndSelect("food.measures", "measure")
            .orderBy("recipe.name", "ASC")
            .take(perPage)
            .skip(skip)
            .getManyAndCount();
        return {
            recipes,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    }

    async create(recipe: any) {
        const newRecipe = this.recipeRepo.create(recipe);
        return this.recipeRepo.save(newRecipe);
    }

    async update(id: number, attrs: Partial<Recipe>) {
        const recipe = await this.findOne(id);

        if (!recipe) {
            throw new NotFoundException("Recipe not found");
        }

        Object.assign(recipe, attrs);
        return this.recipeRepo.save(recipe);
    }

    async remove(id: number) {
        const recipe = await this.findOne(id);

        if (!recipe) {
            throw new NotFoundException("Recipe not found");
        }

        return this.recipeRepo.remove(recipe);
    }

    createCategory(category: any) {
        const newCat = this.categoryRepo.create(category);
        return this.categoryRepo.save(newCat);
    }

    findAllCategories() {
        return this.categoryRepo.find();
    }
}
