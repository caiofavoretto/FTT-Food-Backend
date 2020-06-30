/* eslint-disable import/no-duplicates */
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import GetAttendancesService from '../services/GetAttendancesService';
import GetMenuRatingsService from '../services/GetMenuRatingsService';

import Meal from '../models/Meal';

interface Params {
  meal: Meal;
  date: Date;
  user_id: string;
  menu_id: string;
}

export default async function serializeMeal({
  meal,
  date,
  user_id,
  menu_id,
}: Params): Promise<Meal> {
  const serializedMeal = meal;

  // Serialize dates
  const today = format(new Date(), 'yyyy-MM-dd', {
    locale: pt,
  });

  const dayOfTheWeek = format(new Date(), 'eeee', {
    useAdditionalWeekYearTokens: true,
    locale: pt,
  });

  serializedMeal.dayOfTheWeek = format(date, 'eeee', {
    useAdditionalWeekYearTokens: true,
    locale: pt,
  });

  serializedMeal.date = format(date, 'yyyy-MM-dd', {
    useAdditionalWeekYearTokens: true,
    locale: pt,
  });

  if (
    serializedMeal.dayOfTheWeek === dayOfTheWeek &&
    serializedMeal.date === today
  ) {
    serializedMeal.today = true;
  }

  // Serialize attendance
  const getAttendancesService = new GetAttendancesService();

  const attendant = await getAttendancesService.execute({
    user_id,
    date: parseISO(serializedMeal.date),
  });

  serializedMeal.attendant = attendant[0]?.id || '';

  // Serialize foods
  serializedMeal.foods = meal.foods.map(food => {
    const serializedFood = food;

    if (serializedFood.image_url) {
      serializedFood.image_url = `${process.env.APPLICATION_URL}/files/${serializedFood.image_url}`;
    }
    return serializedFood;
  });

  // Serialize image
  if (serializedMeal.image_url) {
    serializedMeal.image_url = `${process.env.APPLICATION_URL}/files/${serializedMeal.image_url}`;
  }

  // Serialize Rating
  const getMenuRatingsService = new GetMenuRatingsService();

  serializedMeal.rated = await getMenuRatingsService.execute({
    user_id,
    menu_id,
    date,
    meal_id: meal.id,
  });

  serializedMeal.rating =
    serializedMeal.ratings.reduce((accumulator, current) => {
      return accumulator + current.grade;
    }, 0) / serializedMeal.ratings.length;

  delete serializedMeal.ratings;

  return serializedMeal;
}
