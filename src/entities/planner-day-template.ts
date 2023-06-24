import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanTemplate } from "./plan-template";
import { FoodBlockTemplate } from "./food-block-template";

@Entity()
export class PlannerDayTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlanTemplate, (plan) => plan.plannerDays)
    plan: PlanTemplate;

    @Column()
    day: number;

    @OneToMany(() => FoodBlockTemplate, (foodBlock) => foodBlock.plannerDay, { cascade: ["insert"] })
    foodBlocks: FoodBlockTemplate[];

}