/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FoodsModule } from "./foods/foods.module";
import { AuthModule } from "./auth/auth.module";
import { User } from "./entities/user.entity";
import { Food } from "./entities/food.entity";
import { RecipesModule } from "./recipes/recipes.module";
import { Recipe } from "./entities/recipe.entity";
import { Ingredient } from "./entities/ingredient.entity";
import { MulterModule } from "@nestjs/platform-express";
import { Step } from "./entities/step.entity";
import { Measure } from "./entities/measure.entity";
import { MealsModule } from './meals/meals.module';
import { Meal } from "./entities/meal";
import { MealItem } from "./entities/meal-item";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      database: "planner_db_dev_v1",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      migrations: ["migrations/*.js"],
      migrationsTableName: "custom_migration_table",
      entities: [User, Food, Measure, Recipe, Ingredient, Step, Meal, MealItem],
      synchronize: true,
    }),
    MulterModule.register({
      dest: "./uploads",
    }),
    AuthModule,
    FoodsModule,
    RecipesModule,
    MealsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
