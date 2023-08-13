import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { TemplateProDay } from "./template-pro-day";
import { calculateCalories } from "src/utils/nutrient-sum";

@Entity()
export class MealBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TemplateProDay, (templateDay) => templateDay.meals)
    templateDay: TemplateProDay;

    @Column()
    order: number;

    @Column()
    label: string;

    @Exclude()
    @Column()
    carbs: number;

    @Exclude()
    @Column()
    fat: number;

    @Exclude()
    @Column()
    protein: number;

    @Expose()
    get goalMacros() {
        return {
            carbs: this.carbs,
            fat: this.fat,
            protein: this.protein,
            calories: calculateCalories(this.protein, this.carbs, this.fat)
        };
    }

}