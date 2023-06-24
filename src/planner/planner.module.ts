import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/plan';
import { PlanTemplate } from 'src/entities/plan-template';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PlanTemplate])],
  controllers: [PlannerController],
  providers: [PlannerService]
})
export class PlannerModule {}
