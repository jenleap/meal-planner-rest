import { Food } from "src/entities/food.entity";
import { Expose } from "class-transformer";
import { nutrientLabels } from "src/utils/constants";

export class IngredientDto {
    food: Food;

    measureId: number;

    @Expose()
    quantity: number;

    @Expose()
    notes: string

    @Expose()
    get name() {
        return this.food.name;
    }

    @Expose()
    get measure() {
        return this.food.measures.filter(m => m.id === this.measureId)[0];
    }

    @Expose()
    get nutrientInfo() {
        const nutrients = {};
        nutrientLabels.forEach(nutrient => {
            const actualQuantity =  this.quantity / this.measure.quantity;
            nutrients[nutrient] = parseFloat(nutrients[nutrient]) + (actualQuantity * this.measure[nutrient]);
        });
        return nutrients;
    }
}