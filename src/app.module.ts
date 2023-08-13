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
import { PlannerModule } from './planner/planner.module';
import { PlanTemplate } from "./entities/plan-template";
import { Plan } from "./entities/plan";
import { PlannerDay } from "./entities/planner-day";
import { PlannerDayTemplate } from "./entities/planner-day-template";
import { FoodBlock } from "./entities/food-block";
import { FoodBlockTemplate } from "./entities/food-block-template";
import { FoodItem } from "./entities/food-item";
import { PlannerProModule } from "./planner-pro/planner-pro.module";
import { TemplatePro } from "./entities/template-pro";
import { TemplateProDay } from "./entities/template-pro-day";
import { PlanPro } from "./entities/plan-pro";
import { MealBlock } from "./entities/meal-block";
import { FoodItemPro } from "./entities/food-item-pro";
import { FoodBlockPro } from "./entities/food-block-pro";
import { PlanProDay } from "./entities/plan-pro-day";

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
      entities: [
        User, 
        Food, 
        Measure, 
        Recipe, 
        Ingredient, 
        Step, 
        Meal, 
        MealItem,
        Plan,
        PlanTemplate,
        PlannerDay,
        PlannerDayTemplate,
        FoodBlock,
        FoodBlockTemplate,
        FoodItem,
        TemplatePro,
        TemplateProDay,
        PlanPro,
        MealBlock,
        FoodItemPro,
        FoodBlockPro,
        PlanProDay
      ],
      synchronize: true,
    }),
    MulterModule.register({
      dest: "./uploads",
    }),
    AuthModule,
    FoodsModule,
    RecipesModule,
    MealsModule,
    PlannerModule,
    PlannerProModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
