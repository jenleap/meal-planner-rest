import { Exclude, Expose } from "class-transformer";
import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from "typeorm";
import { Food } from "./food.entity";
import { Recipe } from "./recipe.entity";

@Entity()
export class Ingredient {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
    recipe: Recipe;

    @Exclude()
    @ManyToOne(() => Food)
    food: Food;

    @Column({ type: "float" })
    quantity: number;

    @Exclude()
    @Column()
    measureId: number;

    @Column()
    notes: string

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