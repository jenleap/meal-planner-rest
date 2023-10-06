import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";
import { FoodItem } from "./food-item";
import { PlannerDay } from "./planner-day";

@Entity()
export class FoodBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlannerDay, (plannerDay) => plannerDay.foodBlocks, { onDelete: 'CASCADE' })
    plannerDay: PlannerDay;

    @Column()
    order: number;

    @Column()
    label: string;

    @Column()
    type: "meal" | "snack";

    @OneToMany(() => FoodItem, (foodItem) => foodItem.foodBlock, { cascade: ["insert"] })
    foodItems: FoodItem[];

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

}