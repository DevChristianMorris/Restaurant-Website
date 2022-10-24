import React, { useEffect, useState } from "react";
import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const ReservationList = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [reservation, setReservation] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [getAccessTokenSilently]);

  if (reservation.length === 0) {
    return (
      <>
        <p className="error">Sorry! We can't find any reservations</p>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Upcoming Reservations</h1>
      {reservation.map((reservation) => {
        return (
          <li class="reservationlist" key={reservation.id}>
            <div class="reservationinfo">
              <h2>{reservation.restaurantName}</h2>
              <h3 class="date">{formatDate(reservation.date)}</h3>
              <p class="viewreservation">
                <Link to={`./${reservation.id}`}>
                  View details <span>&#8594;</span>
                </Link>
              </p>
            </div>
            <p>______________________________________________</p>
          </li>
        );
      })}
    </>
  );
};

export default ReservationList;
