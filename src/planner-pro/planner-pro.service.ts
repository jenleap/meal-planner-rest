import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodBlockPro } from 'src/entities/food-block-pro';
import { FoodItemPro } from 'src/entities/food-item-pro';
import { PlanPro } from 'src/entities/plan-pro';
import { TemplatePro } from 'src/entities/template-pro';
import { TemplateProDay } from 'src/entities/template-pro-day';
import { Repository } from 'typeorm';

@Injectable()
export class PlannerProService {

    constructor(
        @InjectRepository(PlanPro) private plannerRepo: Repository<PlanPro>,
        @InjectRepository(TemplatePro) private templateProRepo: Repository<TemplatePro>,
        @InjectRepository(TemplateProDay) private templateProDayRepo: Repository<TemplateProDay>,
        @InjectRepository(FoodBlockPro) private foodBlockRepo: Repository<FoodBlockPro>,
        @InjectRepository(FoodItemPro) private foodItemRepo: Repository<FoodItemPro>,
        ) {}

    async findAll(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ plans, total ] = await this.plannerRepo
            .createQueryBuilder("plan")
            .innerJoinAndSelect("plan.planDays", "planDay")
                .leftJoinAndSelect("planDay.foodBlocks", "foodBlock")
                    .leftJoinAndSelect("foodBlock.foodItems", "foodItem")
                       .leftJoinAndSelect("foodItem.food", "food")
                            .leftJoinAndSelect("food.measures", "measure")
            .orderBy("plan.title", "ASC")
            .take(perPage)
            .skip(skip)
            .getManyAndCount(); 
        return {
            plans,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    }

    findById(id: number) {
        return this.plannerRepo
            .createQueryBuilder("plan")
            .where("plan.id = :id", { id })
            .innerJoinAndSelect("plan.planDays", "planDay")
                .leftJoinAndSelect("planDay.foodBlocks", "foodBlock")
                    .leftJoinAndSelect("foodBlock.foodItems", "foodItem")
                       .leftJoinAndSelect("foodItem.food", "food")
                            .leftJoinAndSelect("food.measures", "measure")
            .getOne(); 
    }

    create(plan: any) {
        const newPlan = this.plannerRepo.create(plan);
        return this.plannerRepo.save(newPlan);
    }

    async addFoodToPlan(id: number, food: any) {
       const foodBlock = await this.foodBlockRepo
            .createQueryBuilder("foodBlockPro")
            .where("foodBlockPro.id = :id", { id })
            .leftJoinAndSelect("foodBlockPro.foodItems", "foodItem")
                .leftJoinAndSelect("foodItem.food", "food")
                    .leftJoinAndSelect("food.measures", "measure")
            .getOne();

       if (!foodBlock) {
        throw new Error("Food block not found");
       }

       foodBlock.foodItems.push(food);

       return this.foodBlockRepo.save(foodBlock);
    }

    async updateFood(id: number, quantity: number) {
        const foodItem = await this.foodItemRepo
            .createQueryBuilder("foodItem")
            .where("foodItem.id = :id", { id })
            .leftJoinAndSelect("foodItem.food", "food")
                .leftJoinAndSelect("food.measures", "measure")
            .getOne();
 
        if (!foodItem) {
         throw new Error("Food item not found");
        }
 
        foodItem.quantity = quantity;
 
        return this.foodItemRepo.save(foodItem);
    }

    async removeFood(id: number, foodId: number) {
        const foodBlock = await this.foodBlockRepo
        .createQueryBuilder("foodBlock")
        .where("foodBlock.id = :id", { id })
        .leftJoinAndSelect("foodBlock.foodItems", "foodItem")
            .leftJoinAndSelect("foodItem.food", "food")
                .leftJoinAndSelect("food.measures", "measure")
        .getOne();
 
        if (!foodBlock) {
         throw new Error("Food block not found");
        }
 
        const newFoodList = foodBlock.foodItems.filter(item => item.id != foodId);

        foodBlock.foodItems = newFoodList;
 
        return this.foodBlockRepo.save(foodBlock);
     }

    async findAllTemplates(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ templates, total ] = await this.templateProRepo
            .createQueryBuilder("templatePro")
            .leftJoinAndSelect("templatePro.days", "TemplateProDay")
                .leftJoinAndSelect("TemplateProDay.meals", "mealBlock")
            .orderBy("templatePro.title", "ASC")
            .take(perPage)
            .skip(skip)
            .getManyAndCount();
        return {
            templates,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    }

    findTemplateById(id: number) {
        return this.templateProRepo
            .createQueryBuilder("templatePro")
            .where("templatePro.id = :id", { id })
            .innerJoinAndSelect("templatePro.days", "TemplateProDay")
                .leftJoinAndSelect("TemplateProDay.meals", "mealBlock")
            .getOne(); 
    }

    async createTemplate(template: any) {
        const newTemplate = this.templateProRepo.create(template);
        return this.templateProRepo.save(newTemplate);
    }

    async addMealToTemplate(id: number, meal: any) {
        const templateDay = await this.templateProDayRepo
            .createQueryBuilder("templateProDay")
            .where("templateProDay.id = :id", { id })
            .leftJoinAndSelect("templateProDay.meals", "mealBlock")
            .getOne();
 
        if (!templateDay) {
         throw new Error("Template day not found");
        }

        templateDay.meals.push(meal);
 
        return this.templateProDayRepo.save(templateDay);
     }

     async copyDayToTemplate(id: number, meals: any) {
        const templateDay = await this.templateProDayRepo
            .createQueryBuilder("templateProDay")
            .where("templateProDay.id = :id", { id })
            .leftJoinAndSelect("templateProDay.meals", "mealBlock")
            .getOne();
 
        if (!templateDay) {
         throw new Error("Template day not found");
        }

        templateDay.meals = meals;
 
        return this.templateProDayRepo.save(templateDay);
     }
}
