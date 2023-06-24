import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from 'src/entities/meal';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MealsService {

    constructor(@InjectRepository(Meal) private mealsRepo: Repository<Meal>) {}

    async findAll(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ meals, total ] = await this.mealsRepo
            .createQueryBuilder("meal")
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

    async searchMeals(query: string, page: number, perPage: number ) {
        const [meals, total] = await this.mealsRepo.findAndCount({
            where: {
                name: Like(`%${query}%`)
            },
            relations: {
                mealItems: true
            },
            take: perPage,
            skip: (page - 1) * perPage
        });
        
        return {
            meals,
            total,
            total_pages: Math.ceil(total / perPage)
        };        
    }

    create(meal: any) {
        const newMeal = this.mealsRepo.create(meal);
        return this.mealsRepo.save(newMeal);
    }
}
