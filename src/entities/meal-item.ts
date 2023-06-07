import { Exclude, Expose } from "class-transformer";
import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from "typeorm";
import { Food } from "./food.entity";
import { Meal } from "./meal";

@Entity()
export class MealItem {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Meal, (meal) => meal.mealItems)
    meal: Meal;

    @Exclude()
    @ManyToOne(() => Food)
    food: Food;

    @Column({ type: "float" })
    quantity: number;

    @Exclude()
    @Column()
    measureId: number;

    @Expose()
    get name() {
        return this.food.name;
    }

    get measure() {
        return this.food.measures.filter(m => m.id === this.measureId)[0];
    }

    @Expose()
    get measureLabel() {
        return this.measure.label;
    }

}