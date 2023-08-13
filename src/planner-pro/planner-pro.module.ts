import { Module } from '@nestjs/common';
import { PlannerProController } from './planner-pro.controller';
import { PlannerProService } from './planner-pro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan';
import { PlanTemplate } from 'src/entities/plan-template';
import { FoodBlock } from 'src/entities/food-block';
import { FoodItem } from 'src/entities/food-item';
import { TemplatePro } from 'src/entities/template-pro';
import { TemplateProDay } from 'src/entities/template-pro-day';
import { PlanPro } from 'src/entities/plan-pro';
import { MealBlock } from 'src/entities/meal-block';
import { FoodItemPro } from 'src/entities/food-item-pro';
import { FoodBlockPro } from 'src/entities/food-block-pro';
import { PlanProDay } from 'src/entities/plan-pro-day';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PlanTemplate, FoodBlock, FoodItem, PlanPro, TemplatePro, TemplateProDay, MealBlock, FoodItemPro, FoodBlockPro, PlanProDay])],
  controllers: [PlannerProController],
  providers: [PlannerProService]
})
export class PlannerProModule {}
