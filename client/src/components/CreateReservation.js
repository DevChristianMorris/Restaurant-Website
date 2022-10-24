import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = ({ restaurantName }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [partySize, setpartySize] = useState("");
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const reservation = {
      restaurantName,
      partySize: Number(partySize),
      date,
    };
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reservation),
      }
    );

    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate("/reservations");
    }
  };

  if (isError) {
    return (
      <>
        <p className="no-reservations">
          Error creating a reservation, make sure your date is in the future.
          (error status {errorStatus})
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Add a new reservation</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="partySize">Number of guests</label>
          <input
            type="number"
            id="partySize"
            className="form-input"
            value={partySize}
            onChange={(event) => {
              setpartySize(event.target.value);
            }}
            required
          />
        </p>
        <p>
          {" "}
          Date
          <DatePicker
            selected={date}
            onChange={setDate}
            showTimeSelect
            dateFormat="Pp"
            minDate={new Date()}
          />
        </p>
        <button className="submit-btn" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateReservation;
