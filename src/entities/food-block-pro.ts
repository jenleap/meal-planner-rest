import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";
import { PlanProDay } from "./plan-pro-day";
import { calculateCalories } from "src/utils/nutrient-sum";
import { FoodItemPro } from "./food-item-pro";

@Entity()
export class FoodBlockPro {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlanProDay, (planDay) => planDay.foodBlocks, { onDelete: 'CASCADE' })
    planDay: PlanProDay;

    @Column()
    order: number;

    @Column()
    label: string;

    @OneToMany(() => FoodItemPro, (foodItem) => foodItem.foodBlock, { cascade: ["insert"] })
    foodItems: FoodItemPro[];

    @Exclude()
    @Column()
    goalCarbs: number;

    @Exclude()
    @Column()
    goalProtein: number;

    @Exclude()
    @Column()
    goalFat: number;

    @Expose()
    get nutritionalInfo() {
        const nutrientGroup = { ...nutrientObj };

        if (this.foodItems.length > 0) {
            this.foodItems.forEach(item => {
                Object.keys(nutrientGroup).map(key => {
                    const multiplier = item.quantity / item.measure.quantity;
                    nutrientGroup[key] = nutrientGroup[key] + ( item.measure[key] * multiplier);
                })
            });
        }

        Object.keys(nutrientGroup).map(key => {
            nutrientGroup[key] = Math.round(nutrientGroup[key]);
        })

        return nutrientGroup;
    }

    @Expose()
    get goalMacros() {
        return {
            carbs: this.goalCarbs,
            fat: this.goalFat,
            protein: this.goalProtein,
            calories: calculateCalories(this.goalProtein, this.goalCarbs, this.goalFat)
        };
    }

}