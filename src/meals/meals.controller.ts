import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('api/meals')
@UseInterceptors(ClassSerializerInterceptor)
export class MealsController {

    constructor(public mealsService: MealsService) {}

    @Get()
    getMeals(@Query('q') q: string, @Query('page') page = 1, @Query('per') perPage = 10) {
        if (q) {
            return this.mealsService.searchFoods(q, page, perPage);
        } else {
            return this.mealsService.findAll(page, perPage);
        }
    }

    //@UseGuards(AdminGuard)
    @Post()
    createFoods(@Body() body: any) {
        console.log(body);
        return this.mealsService.create(body);
    }

}
