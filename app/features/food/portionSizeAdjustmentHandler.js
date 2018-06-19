function portionSizeAdjustmentHandler(nutritionResponse, requestedDish) {
    var scaledNutritionResponse = nutritionResponse.map(foodItem => {

        for(let i in requestedDish) {
            if(foodItem.desc.ndbno === requestedDish[i].ndbno) {
                // check if unit is in gram
                if(requestedDish[i].portionSize.unit !== 'g') {
                    // convert unit to equivalent gram value
                }
                let portionScale = requestedDish[i].portionSize.value / 100;

                foodItem.nutrients = applyPoritionSize(foodItem.nutrients, portionScale)
            }
        }

        return foodItem;
    })

    return scaledNutritionResponse;
}

function applyPoritionSize(nutrientList, portionScale) {
    let newNutrientList = nutrientList.map( nutrient => {
        nutrient.value = nutrient.value * portionScale;
        return nutrient;
    });

    return newNutrientList;
}

var api = {}
api.portionSizeAdjustmentHandler = portionSizeAdjustmentHandler;

module.exports = api;