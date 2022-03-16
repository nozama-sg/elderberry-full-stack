import React from "react";
import { Center, Image, ScrollView, Box, Spinner } from "native-base";

import ContentList from "../../Homepage/components/FoodCard/ContentList";

const OneMealImage = ({ imgUrl }) => {
  if (imgUrl) {
    return (
      <Center flex={1}>
        <Image source={{ uri: imgUrl }} alt="food pic" size="2xl" />
      </Center>
    );
  } else {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
};

const MealConts = ({ contents, mealId, refresh }) => {
  return (
    <Box w="250px" height="250px">
      <ContentList
        contList={contents.map((e, i) => ({
          ...e,
          key: i,
        }))}
        mealId={mealId}
        isLastMeal={false}
        refresh={refresh}
      />
    </Box>
  );
};

export { OneMealImage, MealConts };
