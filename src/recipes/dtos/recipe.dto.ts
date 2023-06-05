import { Expose, Transform } from "class-transformer";
import { Ingredient } from "src/entities/ingredient.entity";
import { nutrientLabels } from "src/utils/constants";
import { IngredientDto } from "./ingredient.dto";

export class RecipeDto {
    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    servings: number;

    @Expose()
    ingredients: IngredientDto[];

    @Expose()
    get testName(): string {
        return "Test works!"
    }

    @Expose()
    get nutritionalInfo() {
        const nutrients = {};
        this.ingredients.forEach(ing => {
            nutrientLabels.forEach(nutrient => {
               nutrients[nutrient] = parseFloat(nutrients[nutrient]) + ing.nutrientInfo[nutrient];
            })
        });
        return nutrients;
        /* return Object.keys(nutrients).map(key => {
            return {
                name: key, 
                amount: nutrients[key] / this.servings
            }
        }); */
    }
}