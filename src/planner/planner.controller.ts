import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { PlannerService } from './planner.service';

@Controller('api/planner')
@UseInterceptors(ClassSerializerInterceptor)
export class PlannerController {

    constructor(public plannerService: PlannerService) {}

    @Get()
    getPlans(@Query('page') page = 1, @Query('per') perPage = 10) {
            return this.plannerService.findAll(page, perPage);
    }

    //@UseGuards(AdminGuard)
    @Post()
    createPlan(@Body() body: any) {
        console.log(body);
        return this.plannerService.create(body);
    }

    @Get('/templates')
    getPlanTemplates(@Query('page') page = 1, @Query('per') perPage = 10) {
        return this.plannerService.findAllTemplates(page, perPage);
    }

    //@UseGuards(AdminGuard)
    @Post('/templates')
    createPlanTemplate(@Body() body: any) {
        console.log(body);
        return this.plannerService.createTemplate(body);
    }
}
