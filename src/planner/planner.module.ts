import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan';
import { PlanTemplate } from 'src/entities/plan-template';
import { FoodBlock } from 'src/entities/food-block';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PlanTemplate, FoodBlock])],
  controllers: [PlannerController],
  providers: [PlannerService]
})
export class PlannerModule {}
