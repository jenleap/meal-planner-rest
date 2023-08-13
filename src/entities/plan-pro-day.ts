import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";
import { FoodBlock } from "./food-block";
import { PlanPro } from "./plan-pro";
import { FoodBlockPro } from "./food-block-pro";
import { calculateNutrientGroup } from "src/utils/nutrient-sum";

@Entity()
export class PlanProDay {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlanPro, (plan) => plan.planDays)
    plan: PlanPro;

    @Column()
    day: number;

    @OneToMany(() => FoodBlockPro, (foodBlock) => foodBlock.planDay, { cascade: ["insert"] })
    foodBlocks: FoodBlockPro[];

    @Expose()
    get dailyMacros() {
        return calculateNutrientGroup(this.foodBlocks, 'nutritionalInfo');
    }

    @Expose()
    get goalMacros() {
        return calculateNutrientGroup(this.foodBlocks, 'goalMacros');
    }

}