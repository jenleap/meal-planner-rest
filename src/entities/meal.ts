import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MealItem } from "./meal-item";
import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";

@Entity()
export class Meal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => MealItem, (mealItem) => mealItem.meal, { cascade: ["insert"] })
    mealItems: MealItem[];

    @Expose()
    get nutritionalInfo() {
        const nutrientGroup = { ...nutrientObj };

        this.mealItems.forEach(item => {
            Object.keys(nutrientGroup).map(key => {
                const multiplier = item.quantity / item.measure.quantity;
                nutrientGroup[key] = nutrientGroup[key] + ( item.measure[key] * multiplier);
            })
        });

        return nutrientGroup;
    }

}