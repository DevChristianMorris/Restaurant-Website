const request = require("supertest");
const app = require("./app");

test("GET /restaurants returns a list of restaurants", async () => {
  const expectedStatus = 200;
  const expectedBody = [
    {
      id: "616005cae3c8e880c13dc0b9",
      name: "Curry Place",
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: "https://i.ibb.co/yftcRcF/indian.jpg",
    },
    {
      id: "616005e26d59890f8f1e619b",
      name: "Thai Isaan",
      description:
        "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
      image: "https://i.ibb.co/HPjd2jR/thai.jpg",
    },
    {
      id: "616bd284bae351bc447ace5b",
      name: "Italian Feast",
      description:
        "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
      image: "https://i.ibb.co/0r7ywJg/italian.jpg",
    },
  ];

  await request(app)
    .get("/restaurants")
    .expect(expectedStatus)
    .expect((response) => {
      expect(response.body).toEqual(expectedBody);
    });
});

test("GET /restaurants/:id should provide a single restaurant", async () => {
  const expected = {
    id: "616005cae3c8e880c13dc0b9",
    name: "Curry Place",
    description:
      "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
    image: "https://i.ibb.co/yftcRcF/indian.jpg",
  };

  await request(app)
    .get("/restaurants/616005cae3c8e880c13dc0b9")
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(expected);
    });
});

it("should return a invalid id message GET/restaurants/:id with a 400 status when invalid id", async () => {
  await request(app)
    .get("/restaurants/bad-id")
    .expect((response) => {
      const expected = { message: "Invalid restaurant id" };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(400);
    });
});

it("should return a not found message GET/restaurants/:id with a 404 status when non existing restaurant", async () => {
  await request(app)
    .get("/restaurants/61480db44ab0cf7175467758")
    .expect((response) => {
      const expected = { message: "Restaurant not found" };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(404);
    });
});

describe("app", () => {
  test("POST /reservations creates a new property", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 5,
      date: "2022-11-10T11:00:00.000Z",
      restaurantName: "string",
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
      });
  });
});

test("POST /reservations returns a 400 when an invalid request body is provided", async () => {
  const expectedStatus = 400;
  const body = {
    partySize: 5,
    date: "2022-11-10T11:00:00.000Z",
    restaurantName: "string",
    userId: "mock-user-id",
    id: "mockid",
  };

  await request(app).post("/reservations").send(body).expect(expectedStatus);
});

test("GET /reservations returns a list of reservations", async () => {
  const expectedStatus = 200;
  const expectedBody = [
    {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
      userId: "mock-user-id",
    },
    {
      id: "614abf0a93e8e80ace792ac6",
      partySize: 2,
      date: "2023-12-03T07:00:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Green Curry",
    },
  ];

  await request(app)
    .get("/reservations")
    .expect(expectedStatus)
    .expect((response) => {
      expect(response.body).toEqual(expectedBody);
    });
});

test("GET /reservations/:id should provide a single reservation", async () => {
  const expected = {
    id: "507f1f77bcf86cd799439011",
    partySize: 4,
    date: "2023-11-17T06:30:00.000Z",
    restaurantName: "Island Grill",
    userId: "mock-user-id",
  };

  await request(app)
    .get("/reservations/507f1f77bcf86cd799439011")
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(expected);
    });
});

it("should return a invalid id message GET/reservations/:id with a 400 status when invalid id", async () => {
  await request(app)
    .get("/reservations/bad-id")
    .expect((response) => {
      const expected = { message: "Invalid reservation id" };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(400);
    });
});

it("should return a not found message GET/reservations/:id with a 404 status when non existing reservation", async () => {
  await request(app)
    .get("/reservations/61480db44ab0cf7175467758")
    .expect((response) => {
      const expected = { message: "Reservation not found" };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(404);
    });
});
