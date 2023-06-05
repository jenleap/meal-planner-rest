import { Controller, Get, UseGuards, Post, Body, Param, NotFoundException, UseInterceptors, ClassSerializerInterceptor, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-helper';
import { RecipesService } from './recipes.service';

@Controller('api/recipes')
@UseInterceptors(ClassSerializerInterceptor)
export class RecipesController {

    constructor(public recipeService: RecipesService) {}

    @Get()
    getRecipes(@Query('page') page: number = 1, @Query('per') perPage: number = 10) {
        return this.recipeService.findAll(page, perPage);
    }

    //@UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName
        }),
        fileFilter: imageFileFilter
    }))
    createRecipe(@Body() body: any, @UploadedFile() file) {
        console.log(body.recipe);
        //const newRecipe = JSON.parse(body.recipe);
        return this.recipeService.create({
            ...body.recipe,
            imagePath: (file) ? file.filename : ""
        });
    }

    @Get('/:id')
    async getRecipe(@Param('id') id: string) {
        const recipe = await this.recipeService.findOne(parseInt(id));

        if (recipe) {
            return recipe;
        } else {
            throw new NotFoundException("Recipe not found.");
        }
    }
}
