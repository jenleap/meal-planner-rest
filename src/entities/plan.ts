import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PlannerDay } from "./planner-day";

@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(() => PlannerDay, (plannerDay) => plannerDay.plan, { cascade: ["insert"] })
    plannerDays: PlannerDay[];

    @Column()
    calories: number;

    @Column()
    carbs: number;

    @Column()
    fat: number;

    @Column()
    protein: number;

    @Expose()
    get dailyMacros() {
        console.log(this.title);
        const nutrientGroup = { ...nutrientObj };

        this.plannerDays.forEach(day => {
            Object.keys(nutrientGroup).map(key => {
                nutrientGroup[key] = nutrientGroup[key] + day.dailyMacros[key];
            })
        });

        Object.keys(nutrientGroup).map(key => {
            nutrientGroup[key] = nutrientGroup[key] / 7;
        })

        return nutrientGroup;
    }
}