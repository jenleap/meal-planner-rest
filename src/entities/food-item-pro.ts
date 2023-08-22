import { Exclude, Expose } from "class-transformer";
import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from "typeorm";
import { Food } from "./food.entity";
import { nutrientObj } from "src/utils/constants";
import { FoodBlockPro } from "./food-block-pro";

@Entity()
export class FoodItemPro {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FoodBlockPro, (foodBlock) => foodBlock.foodItems)
    foodBlock: FoodBlockPro;

    @ManyToOne(() => Food)
    food: Food;

    @Column({ type: "float" })
    quantity: number;

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

    @Expose()
    get nutritionalInfo() {
        const nutrientGroup = { ...nutrientObj };

        Object.keys(nutrientGroup).map(key => {
            nutrientGroup[key] = this.measure[key] * (this.quantity / this.measure.quantity);
        })

        return nutrientGroup;
    }

}