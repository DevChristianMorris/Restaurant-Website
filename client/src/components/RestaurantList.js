import React, { useEffect, useState } from "react";
import "./RestaurantList.css";
import { Link } from "react-router-dom";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/restaurants`
    );
    const data = await response.json();
    setRestaurants(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Restaurants</h1>
      {restaurants.map((restaurant) => {
        return (
          <div class="restaurantlist">
            <li className="grids" key={restaurant.id}>
              <img
                src={restaurant.image}
                class="restaurantlogo"
                alt="restaurant logo"
              />
              <div class="restaurantinfo">
                <h2>{restaurant.name}</h2>
                <h3>{restaurant.description}</h3>
                <h4 class="reservebutton">
                  <Link to={`./Restaurants/${restaurant.id}`}>
                    Reserve now <span>&#8594;</span>
                  </Link>
                </h4>
              </div>
            </li>
          </div>
        );
      })}
    </>
  );
};

export default RestaurantList;
