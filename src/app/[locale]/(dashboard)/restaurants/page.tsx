import React from 'react';
import { RestaurantsClient } from '@/components/dashboard/restaurants/RestaurantsClient';
import { getAllRestaurants, getRestaurantSettings } from '@/app/actions/restaurant';

export default async function RestaurantsPage() {
  const [restaurants, activeRestaurant] = await Promise.all([
    getAllRestaurants(),
    getRestaurantSettings()
  ]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <RestaurantsClient
        restaurants={restaurants}
        activeRestaurantId={activeRestaurant?.id}
      />
    </div>
  );
}
