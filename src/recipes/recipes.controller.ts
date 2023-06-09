import { Controller, Get, UseGuards, Post, Body, Param, NotFoundException, UseInterceptors, ClassSerializerInterceptor, UploadedFile, Query, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-helper';
import { RecipesService } from './recipes.service';
import { Response } from 'express';

@Controller('api/recipes')
@UseInterceptors(ClassSerializerInterceptor)
export class RecipesController {

    constructor(public recipeService: RecipesService) {}

    @Get()
    getRecipes(@Query('page') page = 1, @Query('per') perPage = 10) {
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
        console.log(body, file);
        const newRecipe = JSON.parse(body.recipe);
        return this.recipeService.create({
            ...newRecipe,
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

    @Get('/image/:imagePath')
    async getImage(
        @Param('imagePath') imagePath: string,
        @Res() res: Response
    ) {
        return res.sendFile(imagePath, {
            root: 'uploads'
        });
    }
}
