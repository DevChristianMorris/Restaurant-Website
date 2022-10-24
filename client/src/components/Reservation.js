import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import "./Reservation.css";

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations/${id}`
      );

      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  if (isNotFound) {
    return (
      <>
        <p className="error">Sorry! We can't find that reservation</p>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <li class="reservationlist" key={reservation.id}>
        <div class="singlereservation">
          <h2>{reservation.restaurantName}</h2>
          <h3>{formatDate(reservation.date)}</h3>
          <h4>
            Party size: <span>{reservation.partySize}</span>
          </h4>
        </div>
        <p>-----------------------------------------------------------</p>
      </li>
      <p class="reservationsbackbutton">
        <Link to={`/reservations`}>
          Back to reservations <span>&#8594;</span>
        </Link>
      </p>
    </>
  );
};

export default Reservation;
