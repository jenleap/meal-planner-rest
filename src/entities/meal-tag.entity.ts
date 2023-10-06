import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { Meal } from "./meal";

@Entity()
export class MealTag {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Meal, (meal) => meal.tags)
    meal: Meal;

    @Column()
    tag: string;

}