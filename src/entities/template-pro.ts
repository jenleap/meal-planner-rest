import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TemplateProDay } from "./template-pro-day";
import { Expose } from "class-transformer";
import { nutrientObj } from "src/utils/constants";

@Entity()
export class TemplatePro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(() => TemplateProDay, (day) => day.template, { cascade: ["insert"]})
    days: TemplatePro[];

    @Expose()
    get dailyMacros() {
        if (this.days.length > 0) {
            const nutrientGroup = { ...nutrientObj };

            this.days.forEach(day => {
                Object.keys(nutrientGroup).map(key => {
                    nutrientGroup[key] = nutrientGroup[key] + day.dailyMacros[key];
                });
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