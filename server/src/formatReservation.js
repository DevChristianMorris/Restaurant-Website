const formatReservation = (reservation) => {
  return {
    id: reservation._id,
    partySize: reservation.partySize,
    date: reservation.date,
    restaurantName: reservation.restaurantName,
    createdBy: reservation.createdBy,
    userId: reservation.userId,
    description: reservation.description,
  };
};

module.exports = formatReservation;
