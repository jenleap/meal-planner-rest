import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { Recipe } from "./recipe.entity";

@Entity()
export class RecipeCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Recipe, (recipe) => recipe.categories)
    recipe: Recipe;

    @Column()
    category: string;

}