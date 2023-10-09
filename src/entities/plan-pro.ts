import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { PlannerDay } from "./planner-day";
import { TemplatePro } from "./template-pro";
import { PlanProDay } from "./plan-pro-day";
import { calculateNutrientGroup } from "src/utils/nutrient-sum";

@Entity()
export class PlanPro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(() => PlanProDay, (planDay) => planDay.plan, { cascade: ["insert"]})
    planDays: PlanProDay[];

    @Expose()
    get dailyMacros() {
        if (this.planDays.length > 0) {
            const nutrientGroup = { ...nutrientObj };
            this.planDays.forEach(day => {
                Object.keys(nutrientGroup).map(key => {
                    nutrientGroup[key] = nutrientGroup[key] + day.dailyMacros[key];
                })
            });
    
            Object.keys(nutrientGroup).map(key => {
                nutrientGroup[key] = Math.round(nutrientGroup[key] / 7);
            })
    
            return nutrientGroup;
        } else {
            return [];
        }
        
    }
}