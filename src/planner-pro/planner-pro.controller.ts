import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { PlannerProService } from './planner-pro.service';

@Controller('api/planner-pro')
@UseInterceptors(ClassSerializerInterceptor)
export class PlannerProController {

    constructor(public plannerService: PlannerProService) {}

    @Get()
    getPlans(@Query('page') page = 1, @Query('per') perPage = 10) {
        return this.plannerService.findAll(page, perPage);
    }

    @Get('/templates')
    getPlanTemplates(@Query('page') page = 1, @Query('per') perPage = 10) {
        return this.plannerService.findAllTemplates(page, perPage);
    }

    @Get('/templates/:id')
    getTemplate(@Param('id') id: string,) {
        return this.plannerService.findTemplateById(parseInt(id));
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
        //console.log(body);
        return this.plannerService.updateFood(parseInt(foodId), parseInt(body.quantity));
    }

    @Patch('/templates/copy-day/:id')
    copyDayToTemplate(@Param('id') id: string, @Body() body: any) {
        return this.plannerService.copyDayToTemplate(parseInt(id), body);
    }

    @Patch('/templates/:id')
    addMealToTemplate(@Param('id') id: string, @Body() body: any) {
        return this.plannerService.addMealToTemplate(parseInt(id), body);
    }

    @Patch('/:blockId/:foodId')
    removeFood(@Param('blockId') blockId: string, @Param('foodId') foodId: string) {
        return this.plannerService.removeFood(parseInt(blockId), parseInt(foodId));
    }

    //@UseGuards(AdminGuard)
    @Post('/templates')
    async createPlanTemplate(@Body() body: any) {
        const template = await this.plannerService.createTemplate(body);

        return template; 
    }

    @Delete('/templates/:id')
    removeTemplate(@Param('id') id: string) {
        return this.plannerService.removeTemplate(parseInt(id));
    }

    @Delete('/:id')
    removePlan(@Param('id') id: string) {
        return this.plannerService.remove(parseInt(id));
    }

    
}
