import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository, Like, getRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Food } from "src/entities/food.entity";
import * as path from 'path';
import * as mime from 'mime-types';
import { createWorker, createScheduler, RecognizeResult } from 'tesseract.js';
import * as fs from 'fs';
import { getCalories } from "src/utils/nutrient-sum";

@Injectable()
export class FoodsService {

    constructor(@InjectRepository(Food) private foodsRepo: Repository<Food>) {}

    findOne(id: number) {
        return this.foodsRepo.findOneBy({ id });
    }

    async findAll(page: number, perPage: number) {

        const [foods, total] = await this.foodsRepo.findAndCount({
            relations: {
                measures: true
            },
            take: perPage,
            skip: (page - 1) * perPage,
            order: {
                name: "ASC"
            }
        });

        return {
            foods,
            total,
            total_pages: Math.ceil(total / perPage)
        };
    }

    async searchFoods(query: string, page: number, perPage: number ) {
        //return this.foodsRepo.find({ name: `%${ query }%` });
        /* return getRepository(Food)
                  .createQueryBuilder("food")
                  .where("food.name like :search", { search:`%${query}%` })
                  .getMany(); */
        const [foods, total] = await this.foodsRepo.findAndCount({
            where: {
                name: Like(`%${query}%`)
            },
            take: perPage,
            skip: (page - 1) * perPage
        });
        
        return {
            foods,
            total,
            total_pages: Math.ceil(total / perPage)
        };        
    }

    create(food: any) {
        const newFood = this.foodsRepo.create(food);
        return this.foodsRepo.save(newFood);
    }

    async update(id: number, attrs: Partial<Food>) {
        const food = await this.findOne(id);

        if (!food) {
            throw new NotFoundException("Food not found");
        }

        Object.assign(food, attrs);
        return this.foodsRepo.save(food);
    }

    async remove(id: number) {
        const food = await this.findOne(id);

        if (!food) {
            throw new NotFoundException("Food not found");
        }

        return this.foodsRepo.remove(food);
    }

    async scanLabel(image) {
        const imageType = mime.extension(image.mimetype);
        const imagePath = `${image.path}.${imageType}`;

        try {
            await fs.promises.rename(image.path, imagePath);

            const worker = await createWorker();
  
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
  
            const { data } = await worker.recognize(imagePath);
        
            await worker.terminate();
  
            return { 
                text: data.text, 
                calories: getCalories(data.text),
            };
        } catch (error) {
            throw new InternalServerErrorException('Error performing OCR');
        }
    }
}