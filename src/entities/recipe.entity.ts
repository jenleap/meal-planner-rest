import { Exclude, Expose } from "class-transformer";
import { nutrientLabels, nutrientObj } from "src/utils/constants";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Ingredient } from "./ingredient.entity";
import { Step } from "./step.entity";
import { RecipeCategory } from "./recipe-category.entity";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    servings: number;

    @Column()
    imagePath: string;

    @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, { cascade: ["insert"]})
    ingredients: Ingredient[];

    @OneToMany(() => Step, (step) => step.recipe, { cascade: ["insert"]})
    steps: Step[];

    @ManyToMany(() => RecipeCategory, (category) => category.recipe)
    categories: RecipeCategory[];

    @Expose()
    get nutritionalInfo() {
        const nutrientGroup = { ...nutrientObj };

        this.ingredients.forEach(ing => {
            Object.keys(nutrientGroup).map(key => {
                const multiplier = ing.quantity / ing.measure.quantity;
                nutrientGroup[key] = nutrientGroup[key] + ( ing.measure[key] * multiplier);
            })
        });

        Object.keys(nutrientGroup).map(key => {
            nutrientGroup[key] = nutrientGroup[key] / this.servings;
        })

        return nutrientGroup;
    }
}