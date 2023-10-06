import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Food } from "./food.entity";

@Entity()
export class Measure {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Food, (food) => food.measures, { onDelete: 'CASCADE' })
    food: Food;

    @Column()
    label: string;

    @Column({ type: "float" })
    quantity: number;

    @Column()
    calories: number;

    @Column()
    carbs: number;

    @Column()
    fat: number;

    @Column()
    protein: number;

}