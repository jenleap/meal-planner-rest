import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TemplatePro } from "./template-pro";
import { MealBlock } from "./meal-block";
import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";

@Entity()
export class TemplateProDay {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TemplatePro, (template) => template.days)
    template: TemplatePro;

    @Column()
    dayIndex: number;

    @OneToMany(() => MealBlock, (meal) => meal.templateDay, { cascade: ["insert"] })
    meals: MealBlock[];

    @Expose()
    get dailyMacros() {
        const nutrientGroup = { ...nutrientObj };

        if (this.meals.length > 0) {
            this.meals.forEach(meal => {
                Object.keys(nutrientGroup).map(key => {
                    nutrientGroup[key] = nutrientGroup[key] + meal.goalMacros[key];
                })
            });
        }

        Object.keys(nutrientGroup).map(key => {
            nutrientGroup[key] = Math.round(nutrientGroup[key]);
        })

        return nutrientGroup;
    }

}