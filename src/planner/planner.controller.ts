import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { PlannerService } from './planner.service';

@Controller('api/planner')
@UseInterceptors(ClassSerializerInterceptor)
export class PlannerController {

    constructor(public plannerService: PlannerService) {}

    @Get()
    getPlans(@Query('page') page = 1, @Query('per') perPage = 10) {
        return this.plannerService.findAll(page, perPage);
    }

    @Get('/:id')
    getPlan(@Param('id') id: string,) {
        return this.plannerService.findById(parseInt(id));
    }

    //@UseGuards(AdminGuard)
    @Post()
    createPlan(@Body() body: any) {
        return this.plannerService.create(body);
    }

    @Patch('/:id')
    addFood(@Param('id') id: string, @Body() body: any) {
        return this.plannerService.addFoodToPlan(parseInt(id), body);
    }

    @Patch('/amount-update/:foodId')
    updateFood(@Param('foodId') foodId: string, @Body() body: any) {
        console.log(body);
        return this.plannerService.updateFood(parseInt(foodId), parseInt(body.quantity));
    }

    @Patch('/:blockId/:foodId')
    removeFood(@Param('blockId') blockId: string, @Param('foodId') foodId: string) {
        return this.plannerService.removeFood(parseInt(blockId), parseInt(foodId));
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
