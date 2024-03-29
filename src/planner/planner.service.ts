import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodBlock } from 'src/entities/food-block';
import { FoodItem } from 'src/entities/food-item';
import { Plan } from 'src/entities/plan';
import { PlanTemplate } from 'src/entities/plan-template';
import { Repository } from 'typeorm';

@Injectable()
export class PlannerService {

    constructor(
        @InjectRepository(Plan) private plannerRepo: Repository<Plan>,
        @InjectRepository(PlanTemplate) private planTemplateRepo: Repository<PlanTemplate>,
        @InjectRepository(FoodBlock) private foodBlockRepo: Repository<FoodBlock>,
        @InjectRepository(FoodItem) private foodItemRepo: Repository<FoodItem>,
        ) {}

    async findAll(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ plans, total ] = await this.plannerRepo
            .createQueryBuilder("plan")
            .innerJoinAndSelect("plan.plannerDays", "plannerDay")
                .leftJoinAndSelect("plannerDay.foodBlocks", "foodBlock")
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
            .innerJoinAndSelect("plan.plannerDays", "plannerDay")
                .leftJoinAndSelect("plannerDay.foodBlocks", "foodBlock")
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
            .createQueryBuilder("foodBlock")
            .where("foodBlock.id = :id", { id })
            .leftJoinAndSelect("foodBlock.foodItems", "foodItem")
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
        const [ templates, total ] = await this.planTemplateRepo
            .createQueryBuilder("planTemplate")
            .innerJoinAndSelect("planTemplate.plannerDays", "plannerDayTemplate")
                .innerJoinAndSelect("plannerDayTemplate.foodBlocks", "foodBlockTemplate")
            .orderBy("planTemplate.title", "ASC")
            .take(perPage)
            .skip(skip)
            .getManyAndCount();
        return {
            templates,
            total,
            total_pages: Math.ceil(total / perPage)
        }
    }

    createTemplate(template: any) {
        const newTemplate = this.planTemplateRepo.create(template);
        return this.planTemplateRepo.save(newTemplate);
    }

    async removePlan(id: number) {
        const plan = await this.findById(id);

        if (!plan) {
            throw new NotFoundException("Plan not found");
        }

        return this.plannerRepo.remove(plan);
    }
}
