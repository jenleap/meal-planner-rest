import { Controller, Get, Post, Body, Param, NotFoundException, Query, Delete, Patch, UseGuards, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateFoodDto } from './dtos/create-food.dto';
import { FoodsService } from './foods.service';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-helper';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as mime from 'mime-types';
import { createWorker, createScheduler, RecognizeResult } from 'tesseract.js';
import * as fs from 'fs';

@Controller('api/foods')
export class FoodsController {

    constructor(public foodsService: FoodsService) {}

    @Get()
    getFoods(@Query('q') q: string, @Query('page') page = 1, @Query('per') perPage = 10) {
        if (q) {
            return this.foodsService.searchFoods(q, page, perPage);
        } else {
            return this.foodsService.findAll(page, perPage);
        }
    }

    //@UseGuards(AdminGuard)
    @Post()
    createFoods(@Body() body: CreateFoodDto) {
        console.log(body);
        return this.foodsService.create(body);
    }

    @Get('/:id')
    async getFood(@Param('id') id: string) {
        const food = await this.foodsService.findOne(parseInt(id));

        if (food) {
            return food;
        } else {
            throw new NotFoundException("Food not found.");
        }
    }

    //@UseGuards(AuthGuard)
    @Delete('/:id')
    removeFood(@Param('id') id: string) {
        return this.foodsService.remove(parseInt(id));
    }

    @UseGuards(AuthGuard)
    @Patch() 
    updateFood(@Param('id') id: string, @Body() body: UpdateFoodDto) {
        return this.foodsService.update(parseInt(id), body);
    }

    @Post('/label-scan')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName
        }),
        fileFilter: imageFileFilter
    }))
    scanLabel(@UploadedFile() image) {
        if (!image) {
            throw new BadRequestException('No image file found');
        }

        return this.foodsService.scanLabel(image);
    }
}

