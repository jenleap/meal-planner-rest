import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from 'src/entities/meal';
import { MealTag } from 'src/entities/meal-tag.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MealsService {

    constructor(@InjectRepository(Meal) private mealsRepo: Repository<Meal>,
        @InjectRepository(MealTag) private mealTagRepo: Repository<MealTag>) {}

    async findAll(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ meals, total ] = await this.mealsRepo
            .createQueryBuilder("meal")
            .leftJoinAndSelect("meal.tags", "tag")
            .innerJoinAndSelect("meal.mealItems", "mealItem")
                .innerJoinAndSelect("mealItem.food", "food")
                    .innerJoinAndSelect("food.measures", "measure")
            .orderBy("meal.name", "ASC")
            .take(perPage)
            .skip(skip)
            .getManyAndCount();
        return {
            meals,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    }

    findOne(id: number) {
         return this.mealsRepo
            .createQueryBuilder("meal")
            .leftJoinAndSelect("meal.tags", "tag")
            .innerJoinAndSelect("meal.mealItems", "mealItem")
                .innerJoinAndSelect("mealItem.food", "food")
                    .innerJoinAndSelect("food.measures", "measure")
            .orderBy("meal.name", "ASC")
            .where({ id })
            .getOne();
    }

    async searchMeals(query: string, page: number, perPage: number ) {
        const skip = (page - 1) * perPage;
        const [ meals, total ] = await this.mealsRepo
            .createQueryBuilder("meal")
            .where({ name: Like(`%${query}%`) })
            .leftJoinAndSelect("meal.tags", "tag")
            .innerJoinAndSelect("meal.mealItems", "mealItem")
                .innerJoinAndSelect("mealItem.food", "food")
                    .innerJoinAndSelect("food.measures", "measure")
            .orderBy("meal.name", "ASC")
            .skip(skip)
            .take(perPage)
            .getManyAndCount();
        
        return {
            meals,
            total,
            total_pages: Math.ceil(total / perPage)
        };        
    }

    async findByTag(tagId: number, page: number, perPage: number) {
        const skip = (page - 1) * perPage;
       /*  const [ meals, total ] = await this.mealTagRepo
            .createQueryBuilder("mealTag")
            .where({ id: tagId })
            .select(["mealTag.meal"])
            .innerJoinAndSelect("mealTag.meal", "meal")
                .innerJoinAndSelect("meal.mealItems", "mealItem")
                    .innerJoinAndSelect("mealItem.food", "food")
                        .innerJoinAndSelect("food.measures", "measure")
                .orderBy("meal.name", "ASC")
            .take(perPage)
            .skip(skip)
            .getManyAndCount(); */
        const [ meals, total ] = await this.mealsRepo
            .createQueryBuilder("meal")
            .leftJoinAndSelect("meal.tags", "tag")
            .innerJoinAndSelect("meal.mealItems", "mealItem")
                .innerJoinAndSelect("mealItem.food", "food")
                    .innerJoinAndSelect("food.measures", "measure")
            .where('tag.id =:id', { id: tagId })
            .orderBy("meal.name", "ASC")
            .skip(skip)
            .take(perPage)
            .getManyAndCount();
        return {
            meals,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    }

    create(meal: any) {
        const newMeal = this.mealsRepo.create(meal);
        return this.mealsRepo.save(newMeal);
    }

    createTag(tag: any) {
        const newTag = this.mealTagRepo.create(tag);
        return this.mealTagRepo.save(newTag);
    }

    findAllTags() {
        return this.mealTagRepo.find();
    }

    async remove(id: number) {
        const meal = await this.findOne(id);

        if (!meal) {
            throw new NotFoundException("Meal not found");
        }

        return this.mealsRepo.remove(meal);
    }
}
