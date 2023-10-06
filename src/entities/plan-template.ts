import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlannerDayTemplate } from "./planner-day-template";

@Entity()
export class PlanTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(() => PlannerDayTemplate, (plannerDay) => plannerDay.plan, { cascade: ["insert"]})
    plannerDays: PlannerDayTemplate[];

}