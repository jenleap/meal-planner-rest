import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('api/meals')
@UseInterceptors(ClassSerializerInterceptor)
export class MealsController {

    constructor(public mealsService: MealsService) {}

    @Get()
    getMeals(@Query('q') q: string, @Query('cat') cat: string, @Query('page') page = 1, @Query('per') perPage = 10) {
        if (q) {
            return this.mealsService.searchMeals(q, page, perPage);
        } else if (cat) {
            return this.mealsService.findByTag(parseInt(cat), page, perPage);
        } else {
            return this.mealsService.findAll(page, perPage);
        }
    }

    //@UseGuards(AdminGuard)
    @Post()
    createMeal(@Body() body: any) {
        console.log(body);
        return this.mealsService.create(body);
    }

    //@UseGuards(AuthGuard)
    @Delete('/:id')
    removeMeal(@Param('id') id: string) {
        return this.mealsService.remove(parseInt(id));
    }

    @Get('/tags')
    getMealTags() {
        return this.mealsService.findAllTags();
    }

    @Post('/tags')
    createTag(@Body() body: any) {
        return this.mealsService.createTag(body);
    }

}
