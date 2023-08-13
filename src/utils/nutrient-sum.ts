import { nutrientLabels, nutrientObj } from "./constants";

export const nutrientSum = (items) => {
    const nutrientMap = new Map();

    items.forEach(item => {
        item.nutrientInfo.forEach(nutrient => {
            const valueToSet = (nutrientMap.has(nutrient.name)) ? nutrientMap.get(nutrient.name) + nutrient.amount : nutrient.amount;
                nutrientMap.set(nutrient.name, parseInt(valueToSet));
        })
    });

    return Object.fromEntries(nutrientMap);
}

export const nutrientSumObj = (items) => {
    return items.reduce((acc, item) => {
        if (Object.keys(item).length > 0) {
            nutrientLabels.forEach(nutrient => {
                acc[nutrient] = (acc[nutrient]) ? parseInt(item[nutrient] + acc[nutrient]) : parseInt(item[nutrient]);
            });
        }
        return acc;
    }, {...nutrientObj});
}

export const calculateCalories = (protein, carbs, fat) => {
    return (protein * 4) + (carbs * 4) + (fat * 9);
}

export const calculateNutrientGroup = (items, macroKey) => {
    const nutrientGroup = { ...nutrientObj };

        items.forEach(item => {
            Object.keys(nutrientGroup).map(key => {
                nutrientGroup[key] = nutrientGroup[key] + item[macroKey][key];
            })
        });

        Object.keys(nutrientGroup).map(key => {
            nutrientGroup[key] = Math.round(nutrientGroup[key]);
        })

        return nutrientGroup;
}

export const getCalories = (data) => {
    let calories = null;

    //const regex = /Calories \/ Calories (\d+) c/g;
    const regex = /Calories \/ Calories (\d+)/;
    const match = regex.exec(data);

    console.log(match, data);

    if (match && match.length > 1) {
        calories = parseInt(match[1]);
    }

    return calories;
}

export const getCarbs = (data) => {
    let calories = null;

    //const regex = /Calories \/ Calories (\d+) c/g;
    const regex = /Calories \/ Calories (\d+)/;
    const match = regex.exec(data);

    console.log(match, data);

    if (match && match.length > 1) {
        calories = parseInt(match[1]);
    }

    return calories;
}

