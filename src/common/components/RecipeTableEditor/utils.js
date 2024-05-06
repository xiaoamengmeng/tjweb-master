function buildFoods(recipeData) {
  const foods = []
  recipeData.forEach(item => {
    if (item.meal.length !== 0) {
      item.meal.forEach(food => {
        foods.push({
          food_id: food.food_id,
          meal: food.meal,
          weight: food.weight,
          calories: calcCalories(food)
        })
      })
    }
  })
  return foods
}

function buildRecipeData(menu) {
  const recipeData = defaultRecipeData()
  menu.foods.forEach((food) => {
    const currPane = recipeData.find(item => item.period === food.meal)
    currPane.meal.push({
      name: food.food.name,
      food_id: food.food.id,
      food: food,
      calories: food.food.calories,
      weight: food.weight,
      meal: food.meal,
    })
  })
  return recipeData
}

function calcCalories(food) {
  return Math.round(food.weight / 100 * food.calories)
}

function recipeIsEmpty(recipeData) {
  const foodCount = recipeData.reduce((count, curr ) => {
    return count += curr.meal.length
  }, 0)
  return foodCount === 0
}

function defaultRecipeData() {
  return [
    {
      title: '早餐',
      period: 'breakfast',
      meal: [],
    },
    {
      title: '早加餐',
      period: 'mid_moor',
      meal: [],
    },
    {
      title: '午餐',
      period: 'lunch',
      meal: [],
    },
    {
      title: '午加餐',
      period: 'mid_afternoon',
      meal: [],
    },
    {
      title: '晚餐',
      period: 'dinner',
      meal: [],
    },
    {
      title: '晚加餐',
      period: 'late_night',
      meal: [],
    },
  ]
}

export {
  calcCalories,
  buildFoods,
  buildRecipeData,
  defaultRecipeData,
  recipeIsEmpty,
}
