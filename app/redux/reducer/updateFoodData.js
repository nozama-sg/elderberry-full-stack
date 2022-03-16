const updateLastMeal = (state, action) => {
  return {
    ...state,
    lastMealData: {
      ...state.lastMealData,
      loaded: true,
      ...action.payload.data,
    },
  };
};

const updateFoodGroup = (state, action) => {
  return {
    ...state,
    lastMealData: {
      loaded: true,
      food: state.lastMealData.food.map((e) => {
        if (e.foodId == action.payload.key) {
          return { ...e, foodGroup: action.payload.foodGroup };
        }

        return e;
      }),
    },
  };
};

const addFood = (state, action) => {
  return {
    ...state,
    lastMealData: {
      ...state.lastMealData,
      food: [
        ...state.lastMealData.food,
        {
          foodId: action.payload.foodId,
          foodGroup: action.payload.foodGroup,
          foodName: action.payload.foodName,
        },
      ],
    },
  };
};

export { updateLastMeal, updateFoodGroup, addFood };
