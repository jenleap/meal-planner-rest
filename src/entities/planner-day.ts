import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";
import { FoodBlock } from "./food-block";
import { Plan } from "./plan";

@Entity()
export class PlannerDay {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Plan, (plan) => plan.plannerDays)
    plan: Plan;

    @Column()
    day: number;

    @OneToMany(() => FoodBlock, (foodBlock) => foodBlock.plannerDay, { cascade: ["insert"] })
    foodBlocks: FoodBlock[];

    @Expose()
    get dailyMacros() {
        const nutrientGroup = { ...nutrientObj };

        this.foodBlocks.forEach(block => {
            Object.keys(nutrientGroup).map(key => {
                nutrientGroup[key] = nutrientGroup[key] + block.nutritionalInfo[key];
            })
        });

        return nutrientGroup;
    }

}