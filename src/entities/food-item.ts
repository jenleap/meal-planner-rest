import { Exclude, Expose } from "class-transformer";
import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from "typeorm";
import { Food } from "./food.entity";
import { Meal } from "./meal";
import { FoodBlock } from "./food-block";

@Entity()
export class FoodItem {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FoodBlock, (foodBlock) => foodBlock.foodItems)
    foodBlock: FoodBlock;

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