const formatReservation = require("./formatReservation");

describe("formatReservation", () => {
  it("should format a reservation from Mongoose to API spec", () => {
    const validReservations = {
      createdBy: "Mock description",
      description: "Mock description",
      date: "Mock Description",
      userId: "Mock description",
      partySize: 4,
      restaurantName: "Mock description",
    };
    const received = formatReservation({
      _id: "abc",
      __v: "this-should-be-removed",
      ...validReservations,
    });
    const expected = {
      ...validReservations,
      id: "abc",
    };
    expect(received).toEqual(expected);
  });
});
