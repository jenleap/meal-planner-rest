import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Recipe } from "./recipe.entity";

@Entity()
export class Step {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.steps)
    recipe: Recipe;

    @Column()
    order: number;

    @Column()
    instruction: string;

}