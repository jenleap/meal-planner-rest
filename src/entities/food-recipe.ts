import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";
import { Food } from "./food.entity";

@Entity()
export class FoodRecipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    recipeId: number;
    
    @ManyToOne(() => Food)
    food: Food;
}