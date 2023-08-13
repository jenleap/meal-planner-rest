import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Measure } from "./measure.entity";

@Entity()
export class Food {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @OneToMany(() => Measure, (measure) => measure.food, { cascade: ["insert"] })
    measures: Measure[];

    @Column({ default: true })
    isFood: boolean;

    @Column({ default: null })
    macroType: "protein" | "carb" | "fat" | null;
}