import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlannerDayTemplate } from "./planner-day-template";
import { Expose } from "class-transformer";

@Entity()
export class FoodBlockTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlannerDayTemplate, (plannerDay) => plannerDay.foodBlocks)
    plannerDay: PlannerDayTemplate;

    @Column()
    order: number;

    @Column()
    label: string;

    @Column()
    type: "meal" | "snack";

    @Expose()
    get foodItems() {
        return [];
    }

}