const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const app = express();
const formatRestaurant = require("./formatRestaurant");
const RestaurantModel = require("./models/RestaurantModel");
const formatReservation = require("./formatReservation");
const ReservationModel = require("./models/ReservationModel");
const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth({
  audience: "https://Reservationizr.com",
  issuerBaseURL: `https://dev-lw8spwyi.us.auth0.com/`,
});

app.use(cors());
app.use(express.json());

app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      restaurantName: Joi.string().required(),
      partySize: Joi.number().min(0).required(),
      date: Joi.date().min("now").required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { body, auth } = req;
      const document = {
        userId: auth.payload.sub,

        ...body,
      };

      const reservation = new ReservationModel(document);
      await reservation.save();
      return res.status(201).send(formatReservation(reservation));
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);

app.get("/restaurants", async (req, res) => {
  const restaurants = await RestaurantModel.find({});
  return res.status(200).send(restaurants.map(formatRestaurant));
});

app.get("/restaurants/:id", async (request, response) => {
  const { id } = request.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (isIdValid) {
    const restaurant = await RestaurantModel.findById(id);

    if (restaurant) {
      return response.send(formatRestaurant(restaurant));
    } else {
      return response.status(404).send({ message: "Restaurant not found" });
    }
  } else {
    return response.status(400).send({ message: "Invalid restaurant id" });
  }
});

app.get("/reservations", checkJwt, async (req, res) => {
  const { auth } = req;
  const reservations = await ReservationModel.find({
    userId: auth.payload.sub,
  });
  return res.status(200).send(reservations.map(formatReservation));
});

app.get("/reservations/:id", async (request, response) => {
  const { id } = request.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (isIdValid) {
    const reservation = await ReservationModel.findById(id);

    if (reservation) {
      return response.send(formatReservation(reservation));
    } else {
      return response.status(404).send({ message: "Reservation not found" });
    }
  } else {
    return response.status(400).send({ message: "Invalid reservation id" });
  }
});

app.use(errors());

module.exports = app;
