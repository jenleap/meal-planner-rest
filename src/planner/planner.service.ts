import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan';
import { PlanTemplate } from 'src/entities/plan-template';
import { Repository } from 'typeorm';

@Injectable()
export class PlannerService {

    constructor(
        @InjectRepository(Plan) private plannerRepo: Repository<Plan>,
        @InjectRepository(PlanTemplate) private planTemplateRepo: Repository<PlanTemplate>,
        ) {}

    async findAll(page: number, perPage: number) {
        const skip = (page - 1) * perPage;
        const [ plans, total ] = await this.plannerRepo
            .createQueryBuilder("plan")
            .innerJoinAndSelect("plan.plannerDays", "plannerDay")
                .innerJoinAndSelect("plannerDay.foodBlocks", "foodBlock")
                    .innerJoinAndSelect("foodBlock.foodItems", "foodItem")
                        .innerJoinAndSelect("foodItem.food", "food")
                            .innerJoinAndSelect("food.measures", "measure")
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

    create(plan: any) {
        const newPlan = this.plannerRepo.create(plan);
        return this.plannerRepo.save(newPlan);
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
}
